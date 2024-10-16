# 欢迎使用 Remix！

- 📖 [Remix 文档](https://remix.run/docs)

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=remix-template)

## 开发

运行开发服务器：

```shellscript
npm run dev
```

## 部署

首先，为生产环境构建您的应用：

```sh
npm run build
```

然后以生产模式运行应用：

```sh
npm start
```

现在，您需要选择一个主机进行部署。

### DIY

如果您熟悉部署 Node 应用程序，那么内置的 Remix 应用服务器已经做好了生产准备。

确保部署 `npm run build` 的输出

- `build/server`
- `build/client`

## 样式

此模板已配置 [Tailwind CSS](https://tailwindcss.com/)，提供简单的默认启动体验。您可以使用您喜欢的任何 CSS 框架。有关更多信息，请参见 [Vite 文档中的 CSS](https://vitejs.dev/guide/features.html#css)。