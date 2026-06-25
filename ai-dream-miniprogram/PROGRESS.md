# AI梦境社区 - 微信小程序开发进度

## 项目概述
- **技术栈**: Taro 4.2.0 + React 19 + TypeScript 5.8 + Sass + Zustand
- **项目路径**: D:\MyGame\ai-dream-miniprogram
- **构建命令**: npm run build:weapp（编译到 dist/ 目录）
- **开发命令**: npm run dev:weapp（热更新）
- **微信 AppID**: wxa028898a8f45885e（测试号）
- **后端 API**: http://8.156.36.17/api/v1（FastAPI + PostgreSQL）
- **服务器**: 阿里云 8.156.36.17
- **域名**: vistacloud.cloud（HTTPS，待ICP备案通过后启用）

## 当前状态
- 第一阶段（项目搭建 + 基础框架）✅ 已完成
- 第二阶段（接入真实后端 API）✅ 全部完成
- 内容审核系统 ✅ 三重审核（27内置词+49K扩展词库+AI大模型）
- 删除梦境功能 ✅（详情页+我的页面）
- 全页面实时刷新 ✅（useDidShow）
- 图片持久化存储 ✅（远程图片自动下载到本地，旧图片已迁移）
- 粉丝/关注数统计 ✅（我的页面+用户主页均显示真实数据）
- 他人梦境列表 ✅（GET /dreams/user/{user_id} 公开接口）
- 我的点赞列表 ✅（GET /dreams/liked + 我的页面点赞Tab）
- ICP备案审核中 ⏳

---

## 今日更新（2026-06-25 晚间）

### 1. 分享到社区功能 ✅
- **创建页面**：新增"分享到社区"开关，默认关闭
- **详情页底部栏**：作者可见"分享/取消分享"按钮
- **结果页**：新增"分享到社区"按钮
- **后端**：DreamCreate schema 新增 `is_shared: bool = False`，create_dream 端点处理分享
- **数据库**：dreams 表已添加 is_shared 字段

### 2. 内容审核系统 ✅（全面升级）
| 组件 | 说明 |
|------|------|
| 内置敏感词（27个） | 硬编码关键词，检测不替换（不加星号） |
| 扩展词库（49,766个） | GitHub开源词库，启动时加载到内存，只检测不替换，命中词传给AI参考 |
| AI大模型审核 | DeepSeek，宁可放过不可误杀策略 |
| 覆盖范围 | 梦境标题+描述、评论、昵称、个人简介 |
| 超管豁免 | ❌ 已移除，所有用户一视同仁 |

### 3. 审核前置流程 ✅
```
用户输入标题+描述 → 点击"开始AI解析"
  ↓
① 内容审核（AI审核标题+描述）
  ↓ 不通过 → 直接拒绝，提示用户修改
② AI 解析梦境
  ↓
③ 保存梦境记录
  ↓
④ 生成图片
  ↓
⑤ 返回结果
```

### 4. 删除梦境功能 ✅
- **详情页**：底部栏 🗑 删除按钮（仅作者可见）
- **我的页面**：长按梦境卡片弹出删除确认
- 两处都有二次确认弹窗（confirmColor: #EF4444）
- 删除后自动返回/刷新列表

### 5. 全页面实时刷新 ✅
| 页面 | 修复 |
|------|------|
| 社区首页 | useDidShow — 删除/创建后返回自动刷新 |
| 我的页面 | useDidShow — 删除梦境/编辑资料后返回自动刷新 |
| 消息通知 | useDidShow — 新通知实时显示 |
| 管理后台 | useDidShow — 审核后返回自动刷新待审核列表 |
| 用户主页 | useDidShow — 关注/取消关注后返回状态同步 |

### 6. 敏感词库扩充 ✅
- 从GitHub下载开源敏感词库（Sensitive-lexicon项目）
- 16个分类：色情、政治、暴力、暴恐、涉枪涉爆、赌博、毒品、贪腐、诈骗、广告、涉黑、侵权、违法、违反道德、涉密、其他
- 总计 49,766 个词（排除非法网址类）
- 文件位置：`D:\MyGame\AI_Dream_Project\backend\app\sensitive_words_external.txt`
- 扩展词库只检测不替换，命中词传给AI审核作为参考

### 7. Bug 修复
| Bug | 修复 |
|-----|------|
| 社区推荐排序 500 错误（julianday） | 改为 `EXTRACT EPOCH FROM (now() - created_at) / 3600` |
| 创建梦境 500 错误（is_shared 缺失） | 同步 schemas.py + dreams.py 到服务器 |
| 简介"233"被拒（AI审核过严） | 优化审核prompt：短文本/简介/梦境内容直接通过 |
| 敏感词星号替换 | 去掉星号替换，只检测不替换，审核交给AI |

### 8. 图片持久化存储 ✅
- **问题**：智谱AI返回的图片URL是临时链接，会过期导致图片无法显示
- **解决方案**：创建梦境生成图片后，自动下载到服务器本地 `uploads/images/`
- **已迁移**：数据库中5条已有远程图片全部成功下载到本地
- **实现细节**：
  - `ai_service.py` 新增 `download_and_save_image()` 函数
  - `dreams.py` 创建梦境时调用该函数，将远程URL替换为本地URL
  - `main.py` 挂载 `/api/v1/uploads` 静态文件目录
  - `config.py` 新增 `SERVER_BASE_URL` 配置项
  - 迁移脚本：`migrate_images.py`（一次性，可删除）
- **存储位置**：`/opt/AI_Dream_Project/backend/uploads/images/`
- **访问URL**：`http://8.156.36.17/api/v1/uploads/images/xxx.png`
- **降级机制**：下载失败时保留原始远程URL，不影响主流程

### 9. 微信小程序后台配置 ⏳（等备案通过）
- 当前小程序未使用 `wx.uploadFile` / `wx.downloadFile`
- 图片通过 `<Image src>` 加载，需要 `downloadFile` 域名白名单
- **阻塞**：微信要求 HTTPS 域名，需等 ICP 备案通过后配置 `vistacloud.cloud`

---

## ICP 备案进展

### 当前临时方案
- BASE_URL 临时改为 `http://8.156.36.17/api/v1`（直连服务器 IP）
- 微信开发者工具勾选「不校验合法域名」进行开发调试
- 此方案仅用于开发阶段，提交审核前必须改回 HTTPS + 备案域名

### 备案状态
- 已在阿里云提交备案申请（订单号: 2034790020755）
- 备案类型：个人备案
- 域名：vistacloud.cloud
- 网站名称：梦境织者AI
- 状态：等待阿里云初审 → 工信部短信核验 → 管局审核（预计 3-20 个工作日）

### 备案通过后需操作
1. 将 `request.ts` 的 BASE_URL 改回 `https://vistacloud.cloud/api/v1`
2. 微信小程序后台域名白名单已配置（vistacloud.cloud）
3. 阿里云安全组需开放 443 端口
4. 部署 SSL 证书到新服务器或 DNS 解析指向旧服务器

---

## 已完成的工作（历史记录）

### 1. 项目初始化与构建配置
- 使用 Taro 4.2.0 初始化（原 4.1.9 与 Node.js 22 不兼容，已升级）
- 配置 TypeScript（strict 模式，noUnusedLocals/noUnusedParameters 开启）
- 配置 Sass + CSS Modules（*.module.scss）
- project.config.json 配置 AppID
- designWidth: 750（与 SCSS 中的 750rpx 设计基准一致）
- webpack 5.91.0、react-refresh ^0.14.0

### 2. 已创建的页面（12个）
| 页面 | 路径 | 状态 | 说明 |
|------|------|------|------|
| 社区首页 | pages/index/index | ✅ | 推荐/最新Tab切换，梦境卡片列表，下拉刷新，点赞，useDidShow刷新 |
| 记录梦境 | pages/create/index | ✅ | 标题+描述+心情标签，分享到社区开关，AI审核前置 |
| 梦境详情 | pages/detail/index | ✅ | AI解析卡片、评论区、点赞、举报、分享、删除、评论审核 |
| 梦境结果 | pages/result/index | ✅ | 创建成功展示页，分享到社区按钮 |
| 消息通知 | pages/notification/index | ✅ | 全部/点赞/评论/关注筛选，标记已读，useDidShow刷新 |
| 我的 | pages/mine/index | ✅ | 个人资料Header，梦境列表，长按删除，退出登录，注销账号 |
| 登录 | pages/login/index | ✅ | 微信一键登录，wx.login + wechat-login API |
| 编辑资料 | pages/profile/index | ✅ | 昵称/简介/画风偏好，PUT /users/me |
| 用户主页 | pages/user/index | ✅ | 用户资料展示，关注/取消关注，useDidShow刷新 |
| 管理后台 | pages/admin/index | ✅ | 待审核列表，通过/拒绝操作，useDidShow刷新 |
| 用户协议 | pages/agreement/index | ✅ | 微信审核必须 |
| 隐私政策 | pages/privacy/index | ✅ | 微信审核必须 |

### 3. TabBar 结构
| Tab | 图标文字 | 页面 |
|-----|----------|------|
| 社区 | 🏠 | pages/index/index |
| 记录 | ➕ | pages/create/index |
| 消息 | 🔔 | pages/notification/index |
| 我的 | 👤 | pages/mine/index |

### 4. 内容审核体系（三重防护）
| 层级 | 方式 | 词库规模 | 作用 |
|------|------|----------|------|
| 第一层 | 内置硬编码关键词 | 27 个 | 高频违禁词检测 |
| 第二层 | 外部敏感词库 | 49,766 个 | 广覆盖检测，命中词传给AI参考 |
| 第三层 | AI大模型审核 | DeepSeek | 语义理解，上下文判断 |
| 第四层 | 管理后台人工审核 | - | 超管复核 |

### 5. 后端安全模块
- `security_utils.py` — 敏感词检测、AI审核、危机关键词检测、Prompt注入防护
- `ai_service.py` — 审核prompt（宁可放过不可误杀策略）
- 覆盖：梦境创建、评论、昵称、个人简介、头像URL

---

## 下一步工作

### 🔴 阻塞项：ICP 备案
- 等待个人备案审核通过（预计 3-20 个工作日）
- 备案通过后将 BASE_URL 改回 `https://vistacloud.cloud/api/v1`

### 🟡 优先级 P2（上线前必须）
1. ~~**图片持久化存储**~~ ✅ 已完成（2026-06-25）
   - 后端下载即梦 AI 图片到 /uploads/images/
   - 数据库存相对路径（即梦临时URL会过期）

2. **微信安全 API 接入**（备案通过后）
   - 文本审核 security.msgSecCheck
   - 图片审核 security.mediaCheckAsync

3. **微信小程序后台配置**
   - request 域名白名单: vistacloud.cloud ✅ 已配置
   - uploadFile 域名白名单
   - downloadFile 域名白名单

### 🟢 优先级 P3（功能完善）
4. ~~**粉丝/关注数统计**~~ ✅ 已完成（2026-06-25）
5. ~~**"我的点赞"列表**~~ ✅ 已完成（2026-06-25）
6. ~~**他人梦境列表**~~ ✅ 已完成（2026-06-25）

---

## 关键文件路径

### 后端（阿里云服务器）
- 服务器: root@8.156.36.17
- 后端目录: /opt/AI_Dream_Project/backend
- 主入口: /opt/AI_Dream_Project/backend/app/main.py
- 认证路由: /opt/AI_Dream_Project/backend/app/routers/auth.py
- 用户路由: /opt/AI_Dream_Project/backend/app/routers/users.py
- 梦境路由: /opt/AI_Dream_Project/backend/app/routers/dreams.py
- 社区路由: /opt/AI_Dream_Project/backend/app/routers/community.py
- AI 服务: /opt/AI_Dream_Project/backend/app/ai_service.py
- 安全工具: /opt/AI_Dream_Project/backend/app/security_utils.py
- 外部词库: /opt/AI_Dream_Project/backend/app/sensitive_words_external.txt
- 图片存储: /opt/AI_Dream_Project/backend/uploads/images/
- 迁移脚本: /opt/AI_Dream_Project/backend/migrate_images.py
- 数据库: postgresql://dream_user:Dream2026!@localhost:5432/dream_community
- 重启命令: systemctl restart dream-backend

### 小程序（本地）
- 项目根: D:\MyGame\ai-dream-miniprogram
- 构建输出: D:\MyGame\ai-dream-miniprogram\dist
- Taro 配置: D:\MyGame\ai-dream-miniprogram\config\index.ts
- 页面配置: D:\MyGame\ai-dream-miniprogram\src\app.config.ts
- 请求封装: D:\MyGame\ai-dream-miniprogram\src\services\request.ts
- 认证 Store: D:\MyGame\ai-dream-miniprogram\src\store\useAuth.ts
- Token 管理: D:\MyGame\ai-dream-miniprogram\src\utils\token.ts

---

## 唤醒方式
新对话开始时，告诉 AI：
> 读取 D:\MyGame\ai-dream-miniprogram\PROGRESS.md 了解小程序项目进度，然后继续开发。

关键上下文：
1. 第一、二阶段全部完成，12个页面均接入真实API
2. 内容审核系统：27内置词 + 49K扩展词 + AI大模型，所有用户一视同仁
3. 删除梦境、分享到社区、全页面实时刷新均已实现
4. BASE_URL 临时 http://8.156.36.17/api/v1，备案通过后改回 https
5. **每次构建后需手动创建 dist/comp.wxss**（UTF-8 无 BOM，内容为 `/* comp */`）
6. ICP备案审核中（订单号 2034790020755）
7. 图片持久化已完成：远程图片自动下载到服务器本地，旧图片已迁移
8. 粉丝/关注数统计已完成：我的页面+用户主页均显示真实数据
9. 他人梦境列表已完成：GET /dreams/user/{user_id} 公开接口
10. 下一步优先：微信安全API（备案后）
