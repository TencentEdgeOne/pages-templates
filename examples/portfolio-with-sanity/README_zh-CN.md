# Portfoloi with Sanity
此模板是基于 Next.js 静态生成和 Sanity CMS 的静态作品集。
## Sanity
注册 sanity 账号并创建空间。
根据官方提供的`Getting Started`指引配置空间。
复制[postType.ts](https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/portfolio-with-sanity/postType.ts)内容到项目下并启动开发服务预览。

在 Post 数据结构在创建你自己的内容。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/1f135100-a4b5-4311-8038-ef246602ae47.png)

## 部署模板
在控制台选择 [portfolio-with-sanity模板]()。
填写环境变量：
```
NEXT_PUBLIC_SANITY_PROJECT_ID=${你的 sanity 空间 ID}
NEXT_PUBLIC_SANITY_DATASET=${你的 sanity 数据集}
```
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/752893cb-caf0-4414-902a-8380c6ba243a.png)

## 本地开发
安装依赖： `npm i`

本地调试： `npm run dev`

环境变量：本地创建.env.local
```
NEXT_PUBLIC_SANITY_PROJECT_ID=${your sanity space ID}
NEXT_PUBLIC_SANITY_DATASET=${your sanity dataset}
```