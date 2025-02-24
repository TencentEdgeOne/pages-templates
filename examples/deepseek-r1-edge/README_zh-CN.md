# EdgeOne Pages AI：免费在边缘使用 DeepSeek R1

在边缘函数中使用 DeepSeek R1，同时支持网络搜索功能。

搜索功能使用 [searxng](https://github.com/searxng/searxng)，并通过 [EdgeOne Pages 函数](https://edgeone.ai/document/162227908259442688) 进行封装。

部署后获得与 OpenAI 体验一致的接口，能够与其他第三方工具无缝集成。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=deepseek-r1-edge)

在线体验: [https://deepseek-r1-edge.edgeone.site](https://deepseek-r1-edge.edgeone.site)

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

您可以通过修改 `app/page.tsx` 开始编辑页面。随着您编辑文件，页面会自动更新。

该项目使用 [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) 自动优化和加载 Inter，这是一个自定义的 Google 字体。

## 了解更多

要了解有关 Next.js 的更多信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的特性和 API。
- [学习 Next.js](https://nextjs.org/learn) - 互动式 Next.js 教程。

您可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js/) - 欢迎您的反馈和贡献！
