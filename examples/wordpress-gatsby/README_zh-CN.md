# 提升 WordPress 站点访问速度：部署到 EdgeOne Pages

此示例演示如何把 WordPress 站点部署到 EdgeOne Pages 上，提升访问速度。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=wordpress-gatsby)

完成下面准备工作，填入您的的 WordPress 站点地址作为环境变量，即可部署，例如：https://xxx.com/graphql

## 准备工作

架设 WordPress 服务，登录到控制台 http://xxx.com/wp-admin

安装插件并启用：

- WPGraphQL
- WP Gatsby

## 本地开发

```sh
# 添加.env 文件，写入环境变量
GATSBY_API_URL=http://xxx.com/graphql
```

```sh
# 安装依赖
npm i

# 本地调试
npm run start
```
