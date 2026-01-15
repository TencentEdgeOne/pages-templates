# Nuxt Content Starter

一个现代化、功能丰富的起始模板，用于构建基于 **Nuxt Content** 的内容驱动网站。此模板为博客、文档站点、作品集和任何以内容为核心的 Web 应用程序提供了完整的基础。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=nuxt-content-starter)

## ✨ 功能特性

- 📝 **基于文件的 CMS** - 支持 Markdown、YAML、JSON 或 CSV 格式编写内容
- 📱 **移动端优先** - 完全响应式设计，适配所有设备
- 🔍 **SEO 优化** - 自动生成 meta 标签和结构化数据
- 🚀 **高性能** - 基于 Nuxt 4 构建，性能卓越
- 🔧 **TypeScript 就绪** - 开箱即用的完整 TypeScript 支持

## 🛠 技术栈

- **[Nuxt 4](https://nuxt.com/)** - 直观的 Vue 框架
- **[Nuxt Content](https://content.nuxt.com/)** - 基于 Git 的无头 CMS
- **[Vue 3](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 带有类型语法的 JavaScript

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm、pnpm、yarn 或 bun

### 安装

1. 克隆或下载此模板
2. 安装依赖：

```bash
# npm（推荐用于此项目）
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 开发

在 `http://localhost:3000` 启动开发服务器：

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## 📁 项目结构

```
nuxt-content-starter/
├── app/
│   ├── app.vue              # 根组件
│   └── pages/
│       ├── index.vue        # 首页
│       └── [...slug].vue    # 动态内容页面
├── content/
│   ├── about.md             # 关于页面（Markdown）
│   ├── config.yaml          # 配置示例（YAML）
│   ├── products.json        # 产品数据（JSON）
│   └── statistics.csv       # 分析数据（CSV）
├── public/                  # 静态资源
├── nuxt.config.ts          # Nuxt 配置
└── package.json            # 依赖和脚本
```

## ✍️ 创建内容

### Markdown 文件

在 `content/` 目录中创建 `.md` 文件：

```markdown
---
title: '你的文章标题'
description: '用于 SEO 的文章描述'
date: '2025-01-13'
---

# 你的文章标题

你的内容写在这里...
```

### 数据文件

模板支持多种数据格式：

- **YAML** (`.yaml`) - 配置和结构化数据
- **JSON** (`.json`) - API 响应和复杂数据
- **CSV** (`.csv`) - 表格数据和统计信息

所有数据文件都会自动使用自定义布局渲染。

## 🎨 自定义

### 样式

模板使用作用域 CSS，设计系统灵感来自 Nuxt Content 文档。你可以自定义：

- 组件样式中的颜色和排版
- 响应式设计的布局断点
- 每个 `.vue` 文件中的组件特定样式

### 内容类型

添加新的内容类型：

1. 在 `content/` 目录中创建文件
2. 更新 `[...slug].vue` 中的数据文件检测逻辑
3. 根据需要添加自定义渲染组件

## 🚀 生产环境

构建生产环境应用：

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

本地预览生产环境构建：

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 🌐 部署

此模板可以部署到任何支持 Nuxt 应用程序的托管服务商：

- **Vercel** - 零配置部署
- **Netlify** - 基于 Git 的部署
- **Cloudflare Pages** - 边缘部署
- **GitHub Pages** - 静态托管
- **你自己的服务器** - Node.js 托管

查看 [Nuxt 部署文档](https://nuxt.com/docs/getting-started/deployment) 获取详细说明。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。对于重大更改，请先开启 issue 讨论你想要更改的内容。

### 开发指南

1. Fork 项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

此项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Nuxt 团队](https://nuxt.com/) 提供了出色的框架
- [Nuxt Content 团队](https://content.nuxt.com/) 提供了内容管理系统
- [Vue.js 团队](https://vuejs.org/) 提供了响应式框架

---

**编码愉快！** 🚀

更多信息，请查看：
- [Nuxt 文档](https://nuxt.com/docs)
- [Nuxt Content 文档](https://content.nuxt.com/)
- [Vue 3 文档](https://vuejs.org/)