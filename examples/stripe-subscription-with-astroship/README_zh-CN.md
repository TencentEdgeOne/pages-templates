# 基于 Astroship 的 Stripe 订阅模板

## Preview

![image](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/c6527c27-dbf8-4179-8c98-ad56388a0250.png)

## 开发
### 安装依赖
```bash
npm install
# or
yarn install
# or (recommended)
pnpm install
```

### 本地调试服务

```bash
npm run dev
# or
yarn dev
# or (recommended)
pnpm dev
```

### 预览&构建

```bash
npm run preview
npm run build
# or
yarn preview
yarn build
# or (recommended)
pnpm preview
pnpm build
```


### 接入 Stripe 价格表
根据官方文档创建您自己的价格表
[Document](https://docs.stripe.com/payments/checkout/pricing-table)
并将对应代码替换到`src/componens/pricing.astro`中