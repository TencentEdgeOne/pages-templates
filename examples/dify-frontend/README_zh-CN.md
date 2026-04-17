# webapp-text-generator

基于 [Dify](https://dify.ai) API 构建的通用 Web 前端，支持将任意 Dify 应用（文本生成、工作流、对话、Agent）一键包装成可部署的 Web App。

## 部署

Deploy with EdgeOne Pages.

[![EdgeOne Pages deploy](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=dify-frontend&from=github&dify=true)

## 功能特性

- **四种应用模式自适应** — 自动检测 Dify 应用类型，无需手动配置
  - `completion` — 单轮文本生成
  - `workflow` — 多步骤工作流，含节点追踪面板
  - `chat` — 多轮对话，带会话历史侧边栏
- **流式输出** — SSE 实时渲染 Assistant 回复，打字机效果
- **多模态文件上传** — 支持图片、PDF、Word、Excel、CSV、TXT、Markdown，最多同时附带 5 个文件
- **语音交互** — 语音转文字输入（STT）、文字转语音播报（TTS），跟随 Dify 应用开关
- **推荐问题** — 回复完成后自动展示 Dify 配置的建议问题
- **消息反馈** — 点赞 / 点踩，反馈写入 Dify 后台
- **批量运行** — CSV 上传批量处理，结果导出为 CSV
- **多主题** — Warm / Dark / Cool / Minimal 四套主题，localStorage 持久化
- **国际化** — 中英文切换，跟随 Dify 应用的 `default_language` 自动设置
- **工作流节点追踪** — 可展开/折叠的节点执行详情，含耗时、Token 用量

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 3 |
| 语言 | TypeScript 5 |
| API 客户端 | dify-client 2 |
| Markdown 渲染 | react-markdown + remark-gfm + KaTeX |
| 代码编辑器 | Monaco Editor |
| 国际化 | i18next + react-i18next |
| 工具库 | ahooks · immer · uuid · js-cookie |

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-org/ai-customer-service.git
cd ai-customer-service
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件并填写你的 Dify 应用信息：

```env
# 你的 Dify 应用 API Key（在 Dify 控制台 → 应用 → API 访问 中获取）
APP_KEY=app-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Dify API 地址（自托管则改为你的实例地址）
API_URL=https://api.dify.ai/v1

# 可选：强制指定应用类型，留空则自动检测
# 有效值：chat | agent | workflow | completion
NEXT_PUBLIC_APP_TYPE=
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看效果。

### 4. 构建生产版本

```bash
npm run build
npm run start
```

---

设置 `NEXT_PUBLIC_APP_TYPE` 可跳过自动检测，减少一次网络请求，推荐生产环境使用。

## 项目结构

```
app/
├── api/                       # Next.js Route Handlers（服务端代理 Dify API）
├── components/
│   ├── index.tsx              # 根组件：应用类型检测 + 主题切换
│   ├── chat-generation/       # Chat / Agent 模式主界面
│   ├── completion/            # Completion / Workflow 模式主界面
│   ├── conversation-sidebar/  # 会话列表侧边栏
│   ├── result/                # 输出结果展示（含工作流节点追踪）
│   ├── run-once/              # 单次运行表单
│   ├── run-batch/             # 批量运行（CSV）
│   └── base/                  # 通用 UI 组件
├── page.tsx                   # 页面入口
config/
└── index.ts                   # 全局配置与环境变量读取
types/
└── app.ts                     # 全局 TypeScript 类型定义
service/
└── index.ts                   # 服务层（封装所有 Dify API 调用）
utils/
└── resolve-app-type.ts        # 应用类型检测逻辑
i18n/                          # 国际化配置与语言包
```

## 构建与部署

```bash
# 生产构建
npm run build

# 本地预览
npm start
```

## 开发

```bash
npm run dev          # 开发服务器（Turbopack）
npm run dev:webpack  # 开发服务器（Webpack）
npm run lint         # ESLint 检查
npm run fix          # ESLint 自动修复
```

提交代码时，`lint-staged` 会自动对暂存的 `.ts/.tsx` 文件执行 ESLint 修复，由 Husky 管理 Git hooks。

## License

MIT © 2025
