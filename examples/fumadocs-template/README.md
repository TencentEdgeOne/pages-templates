# Fumadocs Template

<p align="center">
  <a href="https://edgeone.ai/pages/new?template=fumadocs-template">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy to EdgeOne Pages" height="40">
  </a>
</p>

A documentation template built with [Fumadocs](https://fumadocs.dev) for Tencent EdgeOne Pages.

## Features

- **MDX Support** - Write documentation with Markdown and React components
- **Type-Safe** - Full TypeScript support with auto-generated types
- **Built-in Search** - Full-text search powered by Orama
- **Dark Mode** - Automatic dark mode support
- **Performance** - Optimized for speed with Next.js App Router
- **EdgeOne Ready** - Deploy seamlessly to Tencent EdgeOne Pages

## Quick Start

### Prerequisites

- Node.js 18 or later
- pnpm (recommended)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000/docs](http://localhost:3000/docs) to view the documentation.

### Build

```bash
pnpm build
```

## Project Structure

```
fumadocs-template/
├── content/           # MDX documentation files
│   └── docs/         # Documentation content
├── app/              # Next.js App Router
│   ├── docs/        # Docs pages (dynamic routing)
│   ├── api/         # API routes (search)
│   ├── layout.tsx   # Root layout
│   └── globals.css  # Global styles
├── lib/              # Utility libraries
│   ├── source.ts    # Data loader
│   └── layout.shared.tsx # Layout options
├── source.config.ts  # MDX configuration
├── next.config.mjs   # Next.js config with MDX
└── mdx-components.tsx # MDX components
```

## Documentation

- [Introduction](/docs) - Overview of Fumadocs Template
- [Quick Start](/docs/quick-start) - Get started quickly
- [Configuration](/docs/configuration) - Customize your docs
- [Components](/docs/components) - Built-in components
- [Deploying](/docs/deploying) - Deploy to EdgeOne Pages

## Deploy to EdgeOne Pages

### One-Click Deploy

[![Deploy to EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=fumadocs-template)

Click the button above to deploy this template directly to EdgeOne Pages.

### Manual Deploy

1. Fork this repository
2. Go to [EdgeOne Pages Console](https://edgeone.cloud.tencent.com/pages)
3. Import your forked repository
4. Deploy!

### Configuration

The `edgeone.json` file contains the deployment configuration:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Manual Build Settings (Alternative)

- **Build Command**: `pnpm build`
- **Output Directory**: `.next`

## Tech Stack

- [Next.js 15](https://nextjs.org) - React framework
- [Fumadocs](https://fumadocs.dev) - Documentation framework
- [Tailwind CSS 4](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org) - Type safety

## License

MIT
