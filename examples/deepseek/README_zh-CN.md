## Deepseek Playground

通过一个提示生成小型应用程序。由 DeepSeek API 提供支持。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=deepseek)

## 技术栈

- [DeepSeek API](https://platform.deepseek.com/docs) 用于使用 DeepSeek-Coder 模型生成代码
- [Sandpack](https://sandpack.codesandbox.io/) 用于代码沙箱
- 使用 Tailwind 的 Next.js App 路由

你也可以在 [DeepSeek 平台](https://platform.deepseek.com/) 上体验 DeepSeek 模型。

## 克隆与运行

1. 克隆仓库：`git clone https://github.com/YOUR_USERNAME/deepseek-coder`
2. 创建一个 `.env` 文件并添加你的 [DeepSeek API 密钥](https://platform.deepseek.com/api-keys)：`DEEPSEEK_API_KEY=`
3. 运行 `npm install` 和 `npm run dev` 来安装依赖并在本地运行

## 致谢

该项目源自 [deepseekCoder](https://github.com/sing1ee/deepseekCoder)，使用 EdgeOne Pages 免费部署，拥有无限的 CDN 带宽和函数调用。

该项目完全基于 [llamacoder](https://github.com/Nutlope/llamacoder)。请关注 [Nutlope](https://github.com/Nutlope) 并给他们一个星标。
