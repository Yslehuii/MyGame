"""
游戏项目本地记忆库 - MCP 服务器（TF-IDF 版）
路径: D:\MyGame
功能: 遍历项目文件，切片、TF-IDF 向量化，提供智能搜索工具
特性: 启动秒级，搜索比关键词匹配更智能
"""

import os
import re
import sys
import json
import hashlib
import pickle
from pathlib import Path

from mcp.server.fastmcp import FastMCP
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# ==================== 配置 ====================
PROJECT_DIR = Path(r"D:\MyGame")
MEMORY_DIR = PROJECT_DIR / ".memory"
CACHE_DIR = str(MEMORY_DIR / "cache")
CHUNK_MAX_CHARS = 500
TOP_K_RESULTS = 3

SUPPORTED_EXTENSIONS = {".js", ".html", ".css", ".txt", ".md", ".json", ".py"}
CONVERSATIONS_DIR = PROJECT_DIR / "docs" / "conversations"

# 抑制第三方库的 stderr 日志
import logging
logging.getLogger().setLevel(logging.WARNING)

# ==================== 初始化 ====================
mcp = FastMCP("game-project-memory")

_vectorizer = None
_tfidf_matrix = None
_chunks = []
_index_built = False

_cache_file = str(Path(CACHE_DIR) / "tfidf_cache.pkl")
_files_hash_file = str(Path(CACHE_DIR) / "files_hash.json")


# ==================== 文件哈希缓存 ====================


def _compute_files_hash(files: list[Path]) -> str:
    """计算文件列表的哈希值，用于检测文件是否变更"""
    hasher = hashlib.md5()
    for f in sorted(files):
        hasher.update(str(f).encode())
        try:
            hasher.update(str(f.stat().st_mtime_ns).encode())
        except Exception:
            pass
    return hasher.hexdigest()


def _load_cached_hash() -> str:
    """加载缓存的文件哈希"""
    try:
        if os.path.exists(_files_hash_file):
            with open(_files_hash_file, "r") as f:
                return json.load(f).get("hash", "")
    except Exception:
        pass
    return ""


def _save_cached_hash(hash_val: str):
    """保存文件哈希"""
    Path(CACHE_DIR).mkdir(parents=True, exist_ok=True)
    with open(_files_hash_file, "w") as f:
        json.dump({"hash": hash_val}, f)


def _load_cache() -> bool:
    """加载缓存的 TF-IDF 数据"""
    global _vectorizer, _tfidf_matrix, _chunks, _index_built
    try:
        if os.path.exists(_cache_file):
            with open(_cache_file, "rb") as f:
                data = pickle.load(f)
                _vectorizer = data["vectorizer"]
                _tfidf_matrix = data["tfidf_matrix"]
                _chunks = data["chunks"]
                _index_built = True
                return True
    except Exception:
        pass
    return False


def _save_cache():
    """保存 TF-IDF 数据到缓存"""
    Path(CACHE_DIR).mkdir(parents=True, exist_ok=True)
    with open(_cache_file, "wb") as f:
        pickle.dump({
            "vectorizer": _vectorizer,
            "tfidf_matrix": _tfidf_matrix,
            "chunks": _chunks,
        }, f)


# ==================== 文件遍历与切片 ====================


def collect_project_files(root_dir: Path) -> list[Path]:
    """收集项目中所有支持的文件"""
    files = []
    try:
        for entry in root_dir.rglob("*"):
            if (
                entry.is_file()
                and entry.suffix.lower() in SUPPORTED_EXTENSIONS
                and ".memory" not in entry.parts
                and "node_modules" not in entry.parts
                and ".git" not in entry.parts
                and "__pycache__" not in entry.parts
            ):
                files.append(entry)
    except PermissionError:
        pass
    return files


def split_into_chunks(text: str, filepath: Path, max_chars: int = CHUNK_MAX_CHARS) -> list[dict]:
    """将文件内容按段落切成小段"""
    chunks = []
    paragraphs = re.split(r"\n\s*\n", text)

    current_line = 1
    for para in paragraphs:
        if not para.strip():
            current_line += para.count("\n") + 1
            continue

        if len(para) <= max_chars:
            line_count = para.count("\n") + 1
            chunks.append({
                "text": para.strip(),
                "file": str(filepath),
                "line_start": current_line,
                "line_end": current_line + line_count - 1,
            })
            current_line += line_count + 1
            continue

        sub_parts = re.split(r"(?<=[.!?;{}\n])\s*", para)
        buffer = ""
        buffer_start = current_line
        for part in sub_parts:
            if not buffer:
                buffer_start = current_line
            if len(buffer) + len(part) <= max_chars:
                buffer += part
            else:
                if buffer.strip():
                    line_count = buffer.count("\n") + 1
                    chunks.append({
                        "text": buffer.strip(),
                        "file": str(filepath),
                        "line_start": buffer_start,
                        "line_end": buffer_start + line_count - 1,
                    })
                buffer = part
                buffer_start = current_line
            current_line += part.count("\n")

        if buffer.strip():
            line_count = buffer.count("\n") + 1
            chunks.append({
                "text": buffer.strip(),
                "file": str(filepath),
                "line_start": buffer_start,
                "line_end": buffer_start + line_count - 1,
            })
        current_line += 1

    return chunks


def build_index(force: bool = False):
    """扫描项目文件夹，切片、TF-IDF 向量化"""
    global _vectorizer, _tfidf_matrix, _chunks, _index_built

    print("开始索引项目目录...", file=sys.stderr)
    files = collect_project_files(PROJECT_DIR)
    print(f"找到 {len(files)} 个文件", file=sys.stderr)

    if not files:
        print("未找到任何支持类型的文件。", file=sys.stderr)
        return

    # 检查文件是否变更
    current_hash = _compute_files_hash(files)
    cached_hash = _load_cached_hash()

    if not force and current_hash == cached_hash and _index_built:
        print("文件未变更，跳过索引构建。", file=sys.stderr)
        return

    print("文件已变更，开始重建索引...", file=sys.stderr)

    all_chunks = []
    for fpath in files:
        try:
            content = fpath.read_text(encoding="utf-8", errors="ignore")
            chunks = split_into_chunks(content, fpath)
            all_chunks.extend(chunks)
        except Exception as e:
            print(f"读取文件失败 {fpath}: {e}", file=sys.stderr)

    print(f"共切出 {len(all_chunks)} 个文本片段", file=sys.stderr)

    if not all_chunks:
        print("没有可索引的内容。", file=sys.stderr)
        return

    # TF-IDF 向量化
    texts = [c["text"] for c in all_chunks]
    print("正在构建 TF-IDF 索引...", file=sys.stderr)

    _vectorizer = TfidfVectorizer(
        analyzer="char_wb",
        ngram_range=(2, 4),  # 字符级 n-gram，对中文友好
        max_features=10000,
        sublinear_tf=True,
    )
    _tfidf_matrix = _vectorizer.fit_transform(texts)
    _chunks = all_chunks
    _index_built = True

    # 保存缓存
    _save_cache()
    _save_cached_hash(current_hash)

    print(f"索引完成！共 {len(texts)} 条记录", file=sys.stderr)


# ==================== MCP 工具 ====================


@mcp.tool()
def search_project_memory(query: str) -> str:
    """
    在项目记忆库中智能搜索，返回最相关的片段。

    Args:
        query: 查询字符串（自然语言描述）

    Returns:
        最相关的 3 个片段，包含文件名、行号和内容。
    """
    global _index_built

    if not _index_built:
        if not _load_cache():
            build_index()
            if not _index_built:
                return "记忆库为空且无可用文件可索引。"

    if not _chunks:
        return "记忆库为空。"

    # TF-IDF 向量化查询
    query_vec = _vectorizer.transform([query])

    # 计算余弦相似度
    similarities = cosine_similarity(query_vec, _tfidf_matrix).flatten()

    # 获取最相关的 TOP_K 个结果
    top_indices = similarities.argsort()[-TOP_K_RESULTS:][::-1]

    output_lines = [f'查询: "{query}"\n{"=" * 50}']

    found = False
    for i, idx in enumerate(top_indices, 1):
        score = similarities[idx]
        if score < 0.01:  # 相似度太低则忽略
            continue
        found = True
        chunk = _chunks[idx]
        relevance = round(score * 100, 1)
        output_lines.append(
            f"\n--- 结果 #{i} (相关度: {relevance}%) ---\n"
            f"文件: {chunk['file']}\n"
            f"行号: {chunk['line_start']} - {chunk['line_end']}\n"
            f"内容:\n{chunk['text']}"
        )

    if not found:
        output_lines.append("未找到相关结果。")

    return "\n".join(output_lines)


@mcp.tool()
def rebuild_index() -> str:
    """
    强制重新扫描项目文件夹并重建索引。
    当项目文件有变更后调用此工具更新记忆库。
    """
    build_index(force=True)
    return f"索引重建完成。当前记忆库共有 {len(_chunks)} 条记录。"


@mcp.tool()
def save_conversation(title: str, summary: str, key_points: str) -> str:
    """
    保存对话摘要到项目记忆库，下次搜索时可以找到。

    Args:
        title: 对话标题（简短描述，如"角色移动功能讨论"）
        summary: 对话摘要（主要讨论内容和结论）
        key_points: 关键要点（用换行分隔的要点列表）
    """
    import datetime
    CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)

    # 生成文件名
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H%M")
    safe_title = re.sub(r'[^\w\u4e00-\u9fff-]', '_', title)[:50]
    filename = f"{date_str}_{time_str}_{safe_title}.md"
    filepath = CONVERSATIONS_DIR / filename

    # 写入 Markdown 文件
    content = f"""# {title}

**日期:** {now.strftime("%Y-%m-%d %H:%M")}

## 摘要

{summary}

## 关键要点

{key_points}
"""
    filepath.write_text(content, encoding="utf-8")

    # 重建索引以包含新文件
    build_index(force=True)

    return f"对话已保存到: {filepath}"


@mcp.tool()
def save_conversation_raw(content: str) -> str:
    """
    保存原始对话内容到项目记忆库。用于快速保存，内容会自动格式化。

    Args:
        content: 对话内容（可以是任意格式的文本）
    """
    import datetime
    CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)

    # 生成文件名
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H%M")

    # 从内容中提取标题（取第一行或前50个字符）
    first_line = content.strip().split("\n")[0][:50]
    safe_title = re.sub(r'[^\w\u4e00-\u9fff-]', '_', first_line)[:50]
    filename = f"{date_str}_{time_str}_{safe_title}.md"
    filepath = CONVERSATIONS_DIR / filename

    # 写入文件
    md_content = f"""# {first_line}

**日期:** {now.strftime("%Y-%m-%d %H:%M")}

## 对话内容

{content}
"""
    filepath.write_text(md_content, encoding="utf-8")

    # 重建索引以包含新文件
    build_index(force=True)

    return f"对话已保存到: {filepath}"


# ==================== 启动入口 ====================

if __name__ == "__main__":
    # 尝试从缓存加载，有则秒级就绪
    if _load_cache():
        print(f"MCP 服务器已就绪（缓存: {len(_chunks)} 条记录）", file=sys.stderr)
    else:
        print("MCP 服务器已就绪（首次启动需构建索引）", file=sys.stderr)
    mcp.run(transport="stdio")
