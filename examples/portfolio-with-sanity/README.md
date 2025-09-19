# Portfolio with Sanity

This template is a static portfolio built with [Next.js](https://nextjs.org) and Sanity CMS, supporting Incremental Static Regeneration (ISR) functionality.

## Sanity Configuration

Tutorial: https://www.sanity.io/organizations/oa92uat9g/project/k6zvmj0j/getting-started?ref=create-project

Download [postType.ts](https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/portfolio-with-sanity/postType.ts) to your local sanity project to start quickly.

## Deploy template

Open [portfolio-with-sanity template](https://edgeone.ai/pages/new?template=portfolio-with-sanity) in the console.

> The latest version of the code supports direct deployment without filling in environment variables, and the project will directly read the markdown content stored in the repository code. If you don't need CMS for content management, you can directly modify the markdown content to maintain the content.

Fill in environment variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=${your sanity space ID}
NEXT_PUBLIC_SANITY_DATASET=${your sanity dataset}
```

The ISR functionality is configured via the `NEXT_REVALIDATE` parameter in `/src/conf/index.ts` (default: 60 seconds).

> Note: If the above Sanity environment variables are not configured, the ISR functionality will be automatically disabled.

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/98699d3e-dacd-4317-b087-e6e3b8265997.png)
Sanity integration guide: https://edgeone.ai/document/178179132824436736?product=edgedeveloperplatform

## Getting Started

Install dependencies: `npm i`

Local development: `npm run dev`

Environment variables: Create .env.local

```
NEXT_PUBLIC_SANITY_PROJECT_ID=${your sanity space ID}
NEXT_PUBLIC_SANITY_DATASET=${your sanity dataset}
```

> In development mode, ISR behavior is consistent with the production environment. If environment variables are not configured, ISR will also be disabled.
