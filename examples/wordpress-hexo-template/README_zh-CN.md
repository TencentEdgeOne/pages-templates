# 提升 WordPress 站点访问速度：结合 Hexo 部署到 EdgeOne Pages

此示例演示如何把 WordPress 站点部署到 EdgeOne Pages 上，提升访问速度。

此示例基于 [Hexo-Theme-Argon](https://github.com/solstice23/hexo-theme-argon) 开发，集成了 WordPress 作为CMS。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=wordpress-hexo-template)

完成下面准备工作，填入您的的 WordPress 站点地址作为环境变量，即可部署，例如：https://xxx.com

## 本地开发

```sh
# Install dependencies
npm i

# Local debugging
WP_URL=https://your.site.url node scripts/wp-sync.js && hexo serve
```
