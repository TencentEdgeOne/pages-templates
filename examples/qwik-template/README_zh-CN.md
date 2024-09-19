# Qwik City 应用 ⚡️

- [Qwik 文档](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=qwik-template)

## 项目结构

该项目使用 Qwik 和 [QwikCity](https://qwik.dev/qwikcity/overview/)。QwikCity 是 Qwik 之上的一组额外工具，使构建完整站点变得更容易，包括基于目录的路由、布局等。

在你的项目中，你会看到以下的目录结构：

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: 提供基于目录的路由，可以包括一系列的 `layout.tsx` 布局文件，以及一个 `index.tsx` 文件作为页面。此外，`index.ts` 文件是端点。更多信息请参见 [路由文档](https://qwik.dev/qwikcity/routing/overview/)。

- `src/components`: 推荐的组件目录。

- `public`: 任何静态资产，如图片，可以放置在公共目录中。更多信息请参见 [Vite 公共目录](https://vitejs.dev/guide/assets.html#the-public-directory)。

## 添加集成功能和部署

使用 `npm run qwik add` 命令添加额外的集成功能。一些集成示例包括: Cloudflare、Netlify 或 Express 服务器，以及 [静态站点生成器 (SSG)](https://qwik.dev/qwikcity/guides/static-site-generation/)。

```shell
npm run qwik add # 或 `yarn qwik add`
```

## 开发

开发模式使用 [Vite 的开发服务器](https://vitejs.dev/)。`dev` 命令将在开发期间进行服务器端渲染 (SSR)。

```shell
npm start # 或 `yarn start`
```

> 注意: 在开发模式下，Vite 可能请求大量的 `.js` 文件。这并不代表 Qwik 生产构建。

## 预览

预览命令会创建客户端模块的生产构建，`src/entry.preview.tsx` 的生产构建，并运行本地服务器。预览服务器仅是为了方便在本地预览生产构建，不应作为生产服务器使用。

```shell
npm run preview # 或 `yarn preview`
```

## 生产

生产构建将通过运行客户端和服务器构建命令生成客户端和服务器模块。构建命令将使用 TypeScript 对源代码进行类型检查。

```shell
npm run build # 或 `yarn build`
```

## 静态站点生成器 (Node.js)

```shell
npm run build.server
```