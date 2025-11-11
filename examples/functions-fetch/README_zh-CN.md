# EdgeOne Pages 函数：自定义 Fetch

这个示例演示了如何在根路径创建边缘函数，通过函数内自定义逻辑 fetch 静态资源并返回页面内容。展示了如何处理根路径（`/`）和动态路径的请求。

## 核心特性

- **根路径处理器**：自定义边缘函数（`index.js`）处理根路径 `/` 的请求
- **通配路由处理器**：动态路由处理器（`[[id]].js`）管理所有其他路径
- **静态资源穿透**：自动将静态文件（JS、CSS、图片等）穿透到 Pages 平台
- **自定义头部**：添加调试头部信息，用于追踪哪个边缘函数处理了请求

## 重要前置条件

⚠️ **需要自定义域名**：此示例需要为您的 EdgeOne Pages 项目配置自定义域名。默认的预览链接是临时的，这将导致 fetch 功能失效。请在部署前在 EdgeOne Pages 项目设置中添加自定义域名。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=functions-fetch)

## 入门

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果。

您可以通过修改 `app/page.tsx` 开始编辑页面。文件修改后页面会自动更新。

该项目使用 [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) 自动优化并加载 Inter，这是一种自定义的 Google 字体。

## 了解更多

要了解更多有关 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的功能和 API。
- [学习 Next.js](https://nextjs.org/learn) - 互动式 Next.js 教程。

您可以查看 [Next.js 的 GitHub 仓库](https://github.com/vercel/next.js/) - 欢迎您的反馈和贡献！
