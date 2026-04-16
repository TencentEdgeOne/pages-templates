# AI Customer Service — Dify Web Template

基于 [Dify](https://dify.ai) 构建的开源 AI 客服前端模板。支持 Chat、Agent、Workflow 三种 Dify 应用类型，提供**全页客服中心**与**可嵌入浮窗**两种集成方式，开箱即用，5 分钟完成部署。

---

## 部署

Deploy with EdgeOne Pages.

[![EdgeOne Pages deploy](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=ai-customer-service&from=github&dify=true)

## 功能特性

| 特性 | 说明 |
|------|------|
| 多模式支持 | 自动检测 Dify 应用类型：Chat / Agent / Workflow，无需手动配置 |
| 全页客服中心 | `/support` 路由，带会话历史侧边栏，适合独立客服页面 |
| 嵌入式浮窗 | 可拖动浮窗，嵌入任意第三方网站，只改一行配置 |
| iframe 嵌入入口 | `/embed` 路由，稳定的嵌入 URL，支持跨域集成 |
| 文件上传 | 支持图片、文档多类型附件，AI 可理解内容并回复 |
| 语音交互 | 内置 TTS 朗读（文字转语音）和 STT 语音输入 |
| 会话历史 | 自动保存对话历史，支持多会话切换 |
| 国际化 | 内置中英双语，i18n 架构支持扩展更多语言 |
| 流式响应 | SSE（Server-Sent Events）流式输出，响应即时可见 |

---

## 技术栈

- **框架**：Next.js 16 (App Router) + React 19
- **语言**：TypeScript
- **样式**：Tailwind CSS + CSS Modules
- **AI 后端**：Dify API（自托管 / 云端均可）
- **流式协议**：SSE（Server-Sent Events）
- **国际化**：i18next + react-i18next
- **开源协议**：MIT

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

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 演示首页：模拟产品落地页 + 右下角可拖动客服浮窗 |
| `/support` | 全页客服中心：带左侧会话历史侧边栏 |
| `/embed` | 嵌入专用入口：供 iframe 调用，紧凑布局，无导航栏 |

---

## Embed 嵌入使用指南

`/embed` 是为第三方网站集成设计的稳定入口，提供两种嵌入方式。

### 方式一：iframe 直接嵌入（跨域场景）

在你的网页 HTML 中插入以下代码：

```html
<iframe
  src="https://your-domain.com/embed"
  width="400"
  height="600"
  frameborder="0"
  allow="microphone"
  style="border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15);"
></iframe>
```

**参数说明：**
- `src`：将 `your-domain.com` 替换为你部署的域名
- `width` / `height`：根据你的页面布局自由调整，推荐 400×600
- `allow="microphone"`：如需语音输入功能，必须包含此属性

**适用场景：** 跨域集成、需要严格隔离 JS 环境的场景，例如将客服嵌入到独立的官网、营销页、文档站中。

---

### 方式二：浮窗组件集成（同域 / React 项目）

如果你的网站也是基于 Next.js / React 构建，可以直接复用本项目的 `DraggableWidget` 组件，在页面右下角渲染一个可拖动的浮窗客服。本演示首页 (`/`) 即采用此方式。

**步骤 1：** 将 `app/components/draggable-widget/` 目录复制到你的项目中。

**步骤 2：** 在你的页面或 Layout 中引入：

```tsx
import DraggableWidget from '@/components/draggable-widget'

export default function YourPage() {
  return (
    <>
      {/* 你的页面内容 */}
      <main>...</main>

      {/* 右下角浮窗客服，将 embedUrl 改为你部署的客服地址 */}
      <DraggableWidget embedUrl="https://your-domain.com/embed" />
    </>
  )
}
```

**Props 说明：**

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `embedUrl` | `string` | `"/embed"` | 嵌入的 iframe URL，改为你部署的客服地址即可 |
| `title` | `string` | i18n 默认值 | 浮窗标题栏显示的名称 |

**浮窗交互说明：**
- 默认出现在页面右下角，初始为展开状态
- 拖动标题栏可自由移动，边界检测确保面板始终完整保留在视口内
- 点击 `—` 最小化按钮收起为橙色圆形按钮，再次点击重新展开
- 移动端（宽度 ≤ 480px）自动切换为底部全屏抽屉样式

---

### Embed 页面的语言处理

`/embed` 页面在初始化时会从 Dify 应用参数（`/v1/parameters`）读取 `default_language` 字段，并自动同步界面语言，无需通过 URL 手动传参。

---

## 项目结构

```
app/
├── api/                    # Next.js API Routes（Dify 请求代理，保护 API Key 不暴露到浏览器）
│   ├── chat-messages/      # 流式聊天接口
│   ├── conversations/      # 会话管理
│   ├── file-upload/        # 文件上传
│   ├── messages/           # 消息历史 & 反馈
│   ├── workflows/          # Workflow 执行
│   ├── meta/               # 应用元信息
│   └── parameters/         # 应用参数
├── components/
│   ├── customer-service/   # 核心客服组件（消息列表、输入框、会话侧边栏）
│   ├── draggable-widget/   # 可拖动浮窗容器
│   ├── nav-bar/            # 导航栏（含语言切换）
│   ├── product-demo/       # 演示首页内容
│   └── base/               # 通用 UI 基础组件
├── embed/
│   └── page.tsx            # /embed 嵌入入口页
├── support/
│   └── page.tsx            # /support 全页客服页
├── page.tsx                # / 演示首页
└── layout.tsx              # 根 Layout（i18n、语言检测）

i18n/
├── lang/
│   ├── app.en.ts           # 英文翻译
│   └── app.zh.ts           # 中文翻译
└── i18next-config.ts       # i18next 初始化配置

config/
└── index.ts                # 应用配置（API 地址等）

types/
└── app.ts                  # 全局 TypeScript 类型定义
```

---

## 多语言扩展

新增语言只需三步：

1. 在 `i18n/lang/` 新建翻译文件，如 `app.ja.ts`（参照 `app.en.ts` 的结构）
2. 在 `i18n/i18next-config.ts` 的 `resources` 对象中注册新语言
3. 在 `app/components/nav-bar/index.tsx` 的 `LOCALES` 数组中添加语言选项

---

## 环境变量一览

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `APP_KEY` | ✅ | Dify 应用 API Key |
| `API_URL` | ✅ | Dify API 基础地址，默认 `https://api.dify.ai/v1` |
| `NEXT_PUBLIC_APP_TYPE` | 可选 | 强制指定应用类型，留空自动检测（chat / agent / workflow / completion） |

---

## License

MIT © 2025
