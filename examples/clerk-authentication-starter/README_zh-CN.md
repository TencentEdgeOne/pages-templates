# Clerk Authentication Starter

此模板是一个基于 Clerk Authentication 和 Next.js 静态生成的示例模板。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=clerk-authentication-starter)

## Clerk 配置

注册 [Clerk](https://clerk.com/) 并创建一个新项目。
进入[控制台](https://dashboard.clerk.com/last-active?path=api-keys)复制`CLERK_PUBLISHABLE_KEY`备用。

## 环境变量

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${你的 CLERK_PUBLISHABLE_KEY}
// 以下路径在本项目中写死即可
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account
```

## 本地开发

安装依赖：`npm install`
本地调试：`npm run build`
