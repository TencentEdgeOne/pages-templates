# Supabase Auth Starter

此模板是基于 Supabase, Next.js 和 EdgeOne Pages 构建的站点鉴权方案示例。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=supabase-auth-starter)

## 使用方法

### Supabase

注册登录 Supabase 后，创建您自己的项目。

进入项目的 Prject Settings - Data API, 复制 `Project Url`, `Anon Public Key`。

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/0f296398-aa8a-4d8f-b70f-45e4999c8faa.png)

### 部署模板

选择此模板进行部署，在环境变量中填写 Supabase Project Url 和 Supabase Anon Public Key。
点击部署后等待部署完成即可。

### 本地开发

安装依赖：`npm install`

本地开发：`npm run dev`