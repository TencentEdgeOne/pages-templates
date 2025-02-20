# Boost WordPress Site Speed: Deploy to EdgeOne Pages With Hexo

This example demonstrates how to deploy a WordPress site to EdgeOne Pages to enhance access speed.

## Deployment

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=wordpress-gatsby)

Complete the following preparations, fill in your WordPress site address as an environment variable, and you can deploy, for example: https://xxx.com

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)



## Local Development

```sh
# Install dependencies
npm i

# Local debugging
WP_URL=https://your.site.url node scripts/wp-sync.js && hexo serve
```
