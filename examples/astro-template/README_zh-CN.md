# Astro 启动工具包：基础

```sh
npm create astro@latest -- --template basics
```

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 部署

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=astro-template)


## 🚀 项目结构

在你的 Astro 项目中，你会看到以下文件夹和文件：

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro 会在 `src/pages/` 目录中寻找 `.astro` 或 `.md` 文件。每个页面根据其文件名被暴露为一个路由。

`src/components/` 并没有什么特别之处，但我们喜欢把任何 Astro/React/Vue/Svelte/Preact 组件放在这里。

任何静态资产，比如图像，可以放在 `public/` 目录中。

## 🧞 命令

所有命令都需要在项目根目录，通过终端运行：

| 命令                      | 操作                                             |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | 安装依赖                                          |
| `npm run dev`             | 在 `localhost:4321` 启动本地开发服务器           |
| `npm run build`           | 构建你的生产站点到 `./dist/`                     |
| `npm run preview`         | 在部署之前本地预览构建结果                       |
| `npm run astro ...`       | 运行 CLI 命令，如 `astro add`, `astro check`     |
| `npm run astro -- --help` | 获取使用 Astro CLI 的帮助                        |

## 👀 想了解更多？

随时查看[我们的文档](https://docs.astro.build)或加入我们的[Discord 服务器](https://astro.build/chat)。
