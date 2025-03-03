# Stripe Subscription Starter With Astroship

## Preview

![image](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/c6527c27-dbf8-4179-8c98-ad56388a0250.png)

## Development
### Install
```bash
npm install
# or
yarn install
# or (recommended)
pnpm install
```

### Development Server

```bash
npm run dev
# or
yarn dev
# or (recommended)
pnpm dev
```

### Preview & Build

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

### Integrate Stripe Pricing Table
Follow the official documentation to create your own pricing table:
[Stripe Pricing Table Documentation](https://docs.stripe.com/payments/checkout/pricing-table)
Then replace the corresponding code in `src/componens/pricing.astro`