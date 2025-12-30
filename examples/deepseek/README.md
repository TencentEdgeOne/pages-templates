# Deepseek Playground

Generate small apps with one prompt. Powered by [EdgeOne Pages Edge AI](https://pages.edgeone.ai/document/edge-ai).

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=deepseek)

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

## Tech stack

- [EdgeOne Pages Edge AI](https://pages.edgeone.ai/document/edge-ai) for code generation using DeepSeek models deployed on global edge nodes
- [Sandpack](https://sandpack.codesandbox.io/) for the code sandbox
- Next.js app router with Tailwind

## Free Daily Quota

Edge AI provides free daily API calls:

| Model | Daily Limit |
| :--- | :--- |
| `@tx/deepseek-ai/deepseek-v32` | 50 |
| `@tx/deepseek-ai/deepseek-v3-0324` | 50 |
| `@tx/deepseek-ai/deepseek-r1-0528` | 20 |

Learn more about Edge AI: [EdgeOne Pages Edge AI Documentation](https://pages.edgeone.ai/document/edge-ai)

## Using Your Own DeepSeek API Key

If you need unlimited API calls, you can use your own DeepSeek API key:

1. Get an API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Set the `DEEPSEEK_API_KEY` environment variable in your EdgeOne Pages project settings

When `DEEPSEEK_API_KEY` is set, the app will use the DeepSeek API directly instead of Edge AI.

## Cloning & running

1. Clone the repo: `git clone https://github.com/YOUR_USERNAME/deepseek-coder`
2. Run `npm install` and `npm run dev` to install dependencies and run locally

## Credit

This project is derived from [deepseekCoder](https://github.com/sing1ee/deepseekCoder), deployed for free using EdgeOne Pages, with unlimited CDN bandwidth and function calls.

This project is fully based on [llamacoder](https://github.com/Nutlope/llamacoder). Please follow [Nutlope](https://github.com/Nutlope) and give them a star.
