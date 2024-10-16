## Excalidraw Online

这是一个用于在线托管 Excalidraw 的简单项目。它基于 Next.js 并使用 Excalidraw 库。

所有数据存储在浏览器本地，不会上传到服务器。在浏览器刷新后，仍会保留上次编辑的数据。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=excalidraw)

## 入门

首先，运行开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
# 或者
bun dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 查看结果。

你可以通过修改 `app/page.tsx` 来开始编辑页面。文件修改后页面会自动更新。

此项目使用 [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) 自动优化和加载 Inter 字体，这是一个定制的 Google 字体。

## 了解更多

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的特性和 API。
- [学习 Next.js](https://nextjs.org/learn) - 一个交互式的 Next.js 教程。

你可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js/) - 欢迎提供反馈和贡献！