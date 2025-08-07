# 基于 AstroJS 和 Contentful 的静态博客主题

本模板基于[retypeset](https://github.com/radishzzz/astro-theme-retypeset)修改而来，感谢原作者的贡献。
在原模板的基础上添加了 Contentful CMS 的集成。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=blog-with-retypeset-and-contentful)

## 使用方法

### Contentful 配置

- Step1 注册[Contentful](https://www.contentful.com/)账号，并创建一个属于你自己的空间
- Step2 安装 Contentful Cli 并执行 Contentful login 登录
- Step3 获取[数据配置文件 contentful-blog-model.json](https://github.com/TencentEdgeOne/pages-templates/blob/main/examples/blog-with-retypeset-and-contentful/contentful-blog-model.json)。
- Step4 执行导入命令：`contentful space import --content-file contentful-blog-model.json --space-id ${你的 Contentful space id}`
- Step5 复制 Contentful Space Id 和 Contentful Delivery API token 备用

> 更多 Contentful 集成参考文档:https://edgeone.cloud.tencent.com/pages/document/178968240027983872

### 使用本模板

在控制台选择本模板，填写 Contentful Space Id 和 Contentful Delivery API token 到环境变量，点击部署。

### 在 Contentful 中添加内容

使用 Blog 内容类型，添加内容，模板根据 language 字段来区分语言，默认语言为中文。
当同一篇文章有多语言时，请使用同一个 Blog 内容类型并保持 slug 相同，并使用不同的 language 字段来区分。

## 本地开发

### 创建.env 文件，填写变量

```
CONTENTFUL_SPACE_ID=${your space id}
CONTENTFUL_DELIVERY_TOKEN=${Contentful delivery api token}
CONTENTFUL_PREVIEW_TOKEN=${Contentful preview api token}
DEV=true
```

### 启动调试服务

安装依赖: `npm i --legacy-peer-deps`

启动服务: `npm run dev`
