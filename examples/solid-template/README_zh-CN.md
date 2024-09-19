## 使用方法

这些模板的依赖通过 [pnpm](https://pnpm.io) 管理，使用命令 `pnpm up -Lri`。

这就是你看到 `pnpm-lock.yaml` 的原因。不过，任何包管理工具都可以使用。克隆模板后，可以安全地删除该文件。

```bash
$ npm install # 或 pnpm install 或 yarn install
```

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=solid-template)

### 在 [Solid 官网](https://solidjs.com) 上了解更多，并在我们的 [Discord](https://discord.com/invite/solidjs) 上与我们聊天

## 可用脚本

在项目目录中，你可以运行：

### `npm run dev` 或 `npm start`

在开发模式下运行应用程序。<br>
打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

如果你进行编辑，页面会重新加载。<br>

### `npm run build`

为生产环境构建应用程序到 `dist` 文件夹。<br>
它正确地将 Solid 打包为生产模式，并优化构建以达到最佳性能。

构建结果是压缩的，文件名包含哈希。<br>
你的应用程序已准备好进行部署！