# create-svelte

构建 Svelte 项目所需的一切，由 [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte) 提供支持。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=svelte-template)

## 创建项目

如果你能看到这个，说明你可能已经完成了这一步。恭喜你！

```bash
# 在当前目录创建一个新项目
npm create svelte@latest

# 在 my-app 中创建一个新项目
npm create svelte@latest my-app
```

## 开发

创建项目并使用 `npm install`（或 `pnpm install` 或 `yarn`）安装依赖后，启动开发服务器：

```bash
npm run dev

# 或启动服务器并在新浏览器标签中打开应用
npm run dev -- --open
```

## 构建

创建应用的生产版本：

```bash
npm run build
```

你可以使用 `npm run preview` 预览生产构建。

> 要部署你的应用，你可能需要为你的目标环境安装一个 [适配器](https://kit.svelte.dev/docs/adapters)。