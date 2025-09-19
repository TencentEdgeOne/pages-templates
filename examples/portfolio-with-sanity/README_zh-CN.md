# Portfoloi with Sanity

此模板是基于 Next.js 静态生成和 Sanity CMS 的静态作品集，支持增量静态再生 (ISR) 功能。

## Sanity

注册 sanity 账号并创建空间。
根据官方提供的 `Getting Started` 指引配置空间。
复制 [postType.ts](https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/portfolio-with-sanity/postType.ts) 内容到项目下并启动开发服务预览。

在 Post 数据结构在创建你自己的内容。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/1f135100-a4b5-4311-8038-ef246602ae47.png)

## 部署模板

在控制台选择 [portfolio-with-sanity 模板](https://console.cloud.tencent.com/edgeone/pages/new?template=portfolio-with-sanity)。

> 最新版本的代码已经支持免填环境变量直接部署，项目会直接读取保存在仓库代码中的 markdown 内容，如果不需要 CMS 进行内容管理您可以直接修改 markdown 内容以维护内容。

填写环境变量：

```
NEXT_PUBLIC_SANITY_PROJECT_ID=${你的 sanity 空间 ID}
NEXT_PUBLIC_SANITY_DATASET=${你的 sanity 数据集}
```

ISR 功能通过 `/src/conf/index.ts` 中的 `NEXT_REVALIDATE` 参数配置重新生成间隔（默认 60 秒）。

> 注意：若未配置上述 Sanity 环境变量，ISR 功能将自动关闭。

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/752893cb-caf0-4414-902a-8380c6ba243a.png)
Sanity 集成指南：https://edgeone.cloud.tencent.com/pages/document/178968125217869824

## 本地开发

安装依赖： `npm i`

本地调试： `npm run dev`

环境变量：本地创建 .env.local

```
NEXT_PUBLIC_SANITY_PROJECT_ID=${your sanity space ID}
NEXT_PUBLIC_SANITY_DATASET=${your sanity dataset}
```

> 开发模式下 ISR 行为与生产环境一致，未配置环境变量时同样会禁用 ISR 功能。
