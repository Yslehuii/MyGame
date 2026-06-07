# MyGame - 游戏项目

## 简介

这是一个游戏开发项目，包含一个 **MCP 记忆库工具**，可以让 AI 智能搜索项目代码。

## 核心功能

### MCP 记忆库工具 (`memory_server.py`)

让 AI 能够"记住"你的项目代码，自动搜索相关代码来回答问题。

#### 功能特点

- **智能搜索** — 使用 TF-IDF 算法，比关键词匹配更智能
- **秒级启动** — 有缓存机制，启动无需等待
- **中文支持** — 字符级 n-gram，对中文友好
- **对话保存** — 自动保存有价值的对话到记忆库

#### 工具列表

| 工具 | 说明 |
|------|------|
| `search_project_memory` | 智能搜索项目文件，返回相关代码片段 |
| `rebuild_index` | 文件变更后重建索引 |
| `save_conversation` | 保存对话摘要到记忆库 |
| `save_conversation_raw` | 保存原始对话内容 |

## 安装使用

### 1. 下载代码

```bash
git clone https://github.com/Yslehuii/MyGame.git
cd MyGame
```

### 2. 安装依赖

```bash
pip install mcp scikit-learn numpy
```

### 3. 配置 Trae IDE

在 Trae 的设置文件中添加 MCP 服务器配置：

**文件位置：** `%APPDATA%\Trae\User\settings.json`

```json
{
  "mcpServers": {
    "game-memory": {
      "command": "python",
      "args": ["D:\\MyGame\\memory_server.py"],
      "cwd": "D:\\MyGame"
    }
  }
}
```

> 注意：请将路径改成你的实际安装路径

### 4. 重启 Trae IDE

重启后 MCP 工具会自动加载。

## 使用方法

### 搜索项目代码

在对话中直接提问，AI 会自动搜索相关代码：

```
用户: 角色移动功能是怎么实现的？
AI: [自动调用 search_project_memory 搜索相关代码]
```

### 重建索引

当你修改了项目文件后，可以重建索引：

```
用户: 重建索引
AI: [调用 rebuild_index 更新索引]
```

### 保存对话

有价值的对话会自动保存到 `docs/conversations/` 目录。

## 项目结构

```
MyGame/
├── memory_server.py          # MCP 服务器主程序
├── start_mcp.bat             # 启动脚本 (Windows)
├── start_memory.ps1          # 启动脚本 (PowerShell)
├── skills/                   # 技能目录
│   ├── brainstorming/        # 头脑风暴技能
│   └── writing-plans/        # 计划编写技能
├── docs/
│   └── conversations/        # 对话记录
└── .memory/                  # 索引缓存 (自动生成)
```

## 技术栈

- **Python 3.10+**
- **MCP SDK** — Model Context Protocol 服务器框架
- **scikit-learn** — TF-IDF 向量化和相似度计算
- **numpy** — 数值计算

## 许可证

MIT License
