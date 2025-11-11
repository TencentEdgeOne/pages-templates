# EdgeOne Pages Functions: Custom Fetch

This example demonstrates how to create Edge Functions at the root path to fetch and return static resources. It shows how to handle both root path (`/`) and dynamic paths using custom fetch logic within Edge Functions.

## Key Features

- **Root Path Handler**: Custom Edge Function (`index.js`) handles requests to `/`
- **Catch-all Handler**: Dynamic route handler (`[[id]].js`) manages all other paths
- **Static Asset Pass-through**: Automatically passes static files (JS, CSS, images) to the Pages platform
- **Custom Headers**: Adds debugging headers to track which Edge Function handled the request

## Important Prerequisites

⚠️ **Custom Domain Required**: This example requires a custom domain to be configured for your EdgeOne Pages project. The default preview URLs are temporary, which will cause the fetch functionality to fail. Please add a custom domain in your EdgeOne Pages project settings before deploying.

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=functions-fetch)

Live Demo: https://functions-fetch.edgeone.app

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
