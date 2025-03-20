# 基于 Supabase 和 Stripe 的 Saas 独立站模板

## 模板介绍
该模板实现了一个 Saas 独立站几乎所有的常用功能，包含用户管理、订阅支付、播客内容等。
后端: Supabase +  Stripe
内容 CMS: Contentful
前端: AstroJS
模板代码是开源的，您可以自行修改，采用其中的某些模块或者实现。

## 1. 准备工作
### Supabase
本模板的订单数据和用户管理采用 Supabase 的API。

#### 准备 API Key
注册登录 Supabase 后，创建您自己的项目。

进入项目的 Prject Settings - Data API, 复制 `Project Url`, `Anon Public Key`, `Service_role Secret Key`。

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/0f296398-aa8a-4d8f-b70f-45e4999c8faa.png)

#### 初始化数据库
注册后在 Supabase 创建一个新的项目，将 [数据库初始化文件](https://cdnstatic.tencentcs.com/edgeone/pages/docs/database_init.sql) 的内容复制到Supabase 控制台的 SQL Editor 中运行，初始化所需的数据库。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/08263cd8-e0a9-478e-bfaf-51427f7588e8.png)

## Contentful
#### 准备 API Key
注册并登录 Contentful CMS 控制台，点击左上角 Settings - API keys，点击 Add API Key 创建一个新的API Key。
创建完成后，复制`Space ID`,`Content Delivery API - access token`,`Content Preview API - access token`。

#### 创建博客数据模型
安装[`Contentful Cli`](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/)可以直接导入[配置文件](https://cdnstatic.tencentcs.com/edgeone/pages/docs/contentful-export.json)。

也可以从控制台自行创建：
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/571bb14d-11ad-4792-b634-dc9e3dfceb8a.png)

创建完数据模型之后可以自行编写对应的博客内容。

## Stripe
#### 准备 API Key
先给您的应用取一个名字，例如：my-saas-site。

注册 Stripe 账号（模板 Demo 采用的是 Stripe 的测试模式），进入控制台。

左下角 Developers - API Keys，复制 `STRIPE_SECRET_KEY`。

再进入 Developers - WebHooks，点击 `Add destination` 创建一个 WebHook。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/85f02933-80b6-45c0-83f5-b6b65f6f419c.png)
 
WebHooks 的 events 配置中，选择以下事件:

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/f940cb43-59d0-4141-a277-f4f8d642f0c0.png)。

在`Endpoint URL`填入`${您的应用名字}.edgeone.app/stripe/webhook`， 项目成功部署之后 Stripe 上创建的产品都会触发函数更新数据到 Supabase。

创建完 Webhook 之后复制 `Signing secret` 备用。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/c367b540-6cf6-4c5b-8a1a-635eab5e53bf.png)

## 2. 创建应用
### 选择模板
点击进入[部署页面](https://console.cloud.tencent.com/edgeone/pages/new?template=stripe-subscription-with-astroship&from=open_templates)，填入前面准备好的所有环境变量。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/9128f2fd-5a93-4f07-bcad-6075f8d4d721.png)。
点击开始部署。

### 创建项目并等待部署完成
项目部署完成后，可以点击预览链接查看效果。

### 在 Stripe 上配置商品
回到 Stripe 控制台，添加您的订阅商品。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/210da878-c0df-4f6c-b68f-c83c9734db70.png)。
这里添加商品会通过前面配置的 WebHooks 触发您部署的边缘函数，更新商品数据到 Supabase 数据库，方便您更加定制化地管理订单和商品。

### 在 Contentful 配置 WebHook
模板的博客采用 SSG 方案，在项目编译时就生成了静态页面。
在 Contentful 配置 EdgeOne Pages 提供的 Webhooks 可以在 Contentful 的内容发生变化时自动触发重新部署以更新博客内容。
在您的项目设置页中，创建一个新的 WebHook:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/adcb6d0c-3b73-411d-a09d-460239b57957.png)
复制地址到 Contentful 的 WebHooks 中：
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/bff20548-ebdd-490a-86f1-351bd5e657ba.png)
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/7379144a-91f3-4e3e-8e7e-50cbe00e55b3.png)

## 3. 本地开发
将您的项目拉到本地之后，在本地安装 [Edgeone Pages Cli](https://www.npmjs.com/package/edgeone)。
执行`edgeone login`登录。
然后执行 `edgeone link ${您的项目名}` 关联线上配置到本地，环境变量将会被自动写入本地的.env。
#### 配置开发环境变量
在 `.env` 文件中添加以下变量，方便 SDK 处理前后端跨域。
```
FRONT_END_URL_DEV=http://localhost:4321/
PUBLIC_API_URL_DEV=http://localhost:8088/
DEV=true
```
#### 启动前端服务
`npm run dev`

#### 启动函数服务
`edgeone pages dev`