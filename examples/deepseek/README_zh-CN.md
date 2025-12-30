## Deepseek Playground

通过一个提示生成小型应用程序。由 [EdgeOne Pages 边缘 AI](https://pages.edgeone.ai/zh/document/edge-ai) 提供支持。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=deepseek)

## 技术栈

- [EdgeOne Pages 边缘 AI](https://pages.edgeone.ai/zh/document/edge-ai) 用于使用部署在全球边缘节点的 DeepSeek 模型生成代码
- [Sandpack](https://sandpack.codesandbox.io/) 用于代码沙箱
- 使用 Tailwind 的 Next.js App 路由

## 每日免费额度

边缘 AI 提供每日免费 API 调用：

| 模型 | 每日限制 |
| :--- | :--- |
| `@tx/deepseek-ai/deepseek-v32` | 50 次 |
| `@tx/deepseek-ai/deepseek-v3-0324` | 50 次 |
| `@tx/deepseek-ai/deepseek-r1-0528` | 20 次 |

了解更多关于边缘 AI：[EdgeOne Pages 边缘 AI 文档](https://pages.edgeone.ai/zh/document/edge-ai)

## 使用自己的 DeepSeek API Key

如果需要无限制的 API 调用，可以使用自己的 DeepSeek API Key：

1. 从 [DeepSeek 平台](https://platform.deepseek.com/) 获取 API Key
2. 在 EdgeOne Pages 项目设置中配置 `DEEPSEEK_API_KEY` 环境变量

设置 `DEEPSEEK_API_KEY` 后，应用将直接使用 DeepSeek API 而不是边缘 AI。

## 克隆与运行

1. 克隆仓库：`git clone https://github.com/YOUR_USERNAME/deepseek-coder`
2. 运行 `npm install` 和 `npm run dev` 来安装依赖并在本地运行

## 致谢

该项目源自 [deepseekCoder](https://github.com/sing1ee/deepseekCoder)，使用 EdgeOne Pages 免费部署，拥有无限的 CDN 带宽和函数调用。

该项目完全基于 [llamacoder](https://github.com/Nutlope/llamacoder)。请关注 [Nutlope](https://github.com/Nutlope) 并给他们一个星标。
