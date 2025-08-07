# Gatsby Woocommerce Template
从头开始搭建一个电商网站是很繁琐的，本实例基于 WordPress + WooCommerce 后台，实现 Jamstack 架构的电商网站，前端框架是 GatsbyJS。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=gatsby-woocommerce-template)

## 准备 WordPress 应用
### docker 项目（推荐）
我们提供了可供直接部署的 [docker 项目](https://github.com/TencentEdgeOne/wp-ecommerce-docker-demo)，可以直接使用 docker 容器部署到您的服务器上。

### 自行部署
如果您希望自行部署服务，则需要在 WordPress 安装以下插件并激活：
Advanced Custom Fields
WooCommerce
JWT Authentication for WP-API
WPGraphQL
WPGraphQL for ACF
WPGraphQL for WooCommerce (WooGraphQL)
WPGraphQL JWT Authentication

并完成WooCommerce的初始化设置，可以创建几个新商品。

在Pages里创建三个页面：`highlight`, `promotion`, `sample-page`。

在`Advanced Custom Fields`插件里导入 wordpress-data/acf-export-2025-02-13.json
回到上面创建的三个页面里填写 ACF 数据，保存。


完成后端服务的部署之后，将服务地址配置到Edgeone Pages 项目的环境变量中。
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/c55a806a-408a-4149-af14-d59c365c6253.png)

## 启动项目
### 安装依赖
`npm i`

### 本地调试
```
gatsby develop && edgeone pages dev --fePort=8000 
//fePort是 Gatsby 运行端口，Edgeone Pages 命令行工具需要这个参数来处理登录鉴权的跨域
//本地的 .env 除了 WP_URL 之外需要配置加上GATSBY_ENV=dev参数
```
访问`http://localhost:8000/`即可看到项目页面。
