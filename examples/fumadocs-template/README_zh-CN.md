# Fumadocs 模板

<p align="center">
  <a href="https://edgeone.ai/pages/new?template=fumadocs-template">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="部署到 EdgeOne Pages" height="40">
  </a>
</p>

基于 [Fumadocs](https://fumadocs.dev) 构建的文档模板，适用于 Tencent EdgeOne Pages。

## 特性

- **MDX 支持** - 使用 Markdown 和 React 组件编写文档
- **类型安全** - 完整的 TypeScript 支持，自动生成类型
- **内置搜索** - 基于 Orama 的全文搜索
- **深色模式** - 自动深色模式支持
- **高性能** - 基于 Next.js App Router 优化
- **EdgeOne 就绪** - 无缝部署到 Tencent EdgeOne Pages

## 快速开始

### 环境要求

- Node.js 18 或更高版本
- pnpm（推荐）

### 安装

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

打开 [http://localhost:3000/docs](http://localhost:3000/docs) 查看文档。

### 构建

```bash
pnpm build
```

## 项目结构

```
fumadocs-template/
├── content/           # MDX 文档文件
│   └── docs/         # 文档内容
├── app/              # Next.js App Router
│   ├── docs/        # 文档页面（动态路由）
│   ├── api/         # API 路由（搜索）
│   ├── layout.tsx   # 根布局
│   └── globals.css  # 全局样式
├── lib/              # 工具库
│   ├── source.ts    # 数据加载器
│   └── layout.shared.tsx # 布局选项
├── source.config.ts  # MDX 配置
├── next.config.mjs   # Next.js 配置（含 MDX）
└── mdx-components.tsx # MDX 组件
```

## 文档

- [简介](/docs) - Fumadocs 模板概览
- [快速开始](/docs/quick-start) - 快速上手
- [配置](/docs/configuration) - 自定义文档
- [组件](/docs/components) - 内置组件
- [部署](/docs/deploying) - 部署到 EdgeOne Pages

## 部署到 EdgeOne Pages

### 一键部署

[![部署到 EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=fumadocs-template)

点击上方按钮直接将此模板部署到 EdgeOne Pages。

### 手动部署

1. Fork 此仓库
2. 前往 [EdgeOne Pages 控制台](https://edgeone.cloud.tencent.com/pages)
3. 导入 Fork 的仓库
4. 部署！

### 配置

`edgeone.json` 文件包含部署配置：

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 手动构建设置（可选）

- **构建命令**：`pnpm build`
- **输出目录**：`.next`

## 技术栈

- [Next.js 15](https://nextjs.org) - React 框架
- [Fumadocs](https://fumadocs.dev) - 文档框架
- [Tailwind CSS 4](https://tailwindcss.com) - 样式
- [TypeScript](https://www.typescriptlang.org) - 类型安全

## 许可证

MIT
