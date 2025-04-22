# EdgeOne Pages：基于函数实现的 MCP Client 与 MCP Server

## 项目简介

本项目展示了一个基于 EdgeOne Pages 函数技术构建的智能聊天应用。它通过 Web 界面与后端函数进行交互，实现了完整的 MCP（模型上下文协议）工作流。

系统架构由以下核心组件构成：

- MCP Streamable HTTP Server（`functions/mcp-server/index.ts`）
- MCP Client（`functions/mcp-client/index.ts`）
- 后端 API（`functions/v1/chat/completions/index.ts`）作为 MCP HOST，负责协调整个 MCP 工作流

通过这一架构，用户可以在网页中使用强大的 MCP 工具能力，实现"一句话生成在线网页"等智能交互功能。

## 核心功能

- **交互式聊天界面**：基于 Next.js 和 React 构建的现代化、响应式 Web 界面
- **高性能边缘函数**：关键业务逻辑部署在高可扩展的 EdgeOne Pages 函数上
- **完整 MCP 实现**：基于最新规范的模型上下文协议实现，提供强大的上下文管理和请求路由能力
- **兼容 OpenAI 格式**：后端 API 完全支持 OpenAI 格式的请求和响应处理

## Streamable HTTP MCP Server

在支持 `Streamable HTTP MCP Server` 的应用中配置远程 MCP 服务。

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "url": "https://mcp-on-edge.edgeone.site/mcp-server"
    }
  }
}
```

## 快速部署

只需点击下方按钮，即可一键部署到 EdgeOne Pages：

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=mcp-on-edge)

浏览更多模板：[EdgeOne Pages 模板中心](https://edgeone.ai/pages/templates)

## 本地开发

### 环境准备

首先，安装依赖并启动开发服务器：

```bash
# 安装依赖
npm install
# 或使用其他包管理器
# yarn install / pnpm install / bun install

# 启动开发服务器
npm run dev
# 或使用其他包管理器
# yarn dev / pnpm dev / bun dev
```

请配置环境变量：复制 `.env.example` 文件并重命名为 `.env`，然后填入您的 AI 服务接口配置信息。

启动后，在浏览器中访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 项目结构

- 前端界面：`app/page.tsx` 包含主要页面逻辑和 UI 组件
- 后端函数：`functions` 目录下包含所有边缘函数
  - 聊天 API：`functions/v1/chat/completions`
  - MCP 服务端：`functions/mcp-server`
  - MCP 客户端：`functions/mcp-client`

## 技术文档

了解更多相关技术：

- [Next.js 文档](https://nextjs.org/docs) - Next.js 框架特性与 API
- [EdgeOne Pages 函数文档](https://edgeone.ai/document/162227908259442688s) - EdgeOne 无服务器函数详解
- [模型上下文协议 (MCP)](https://modelcontextprotocol.io/specification/2025-03-26/changelog) - 基于 2025-03-26 版本实现的 Streamable HTTP transport
