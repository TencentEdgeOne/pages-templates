# Directory Site Template - Using "Indie Developers' Toolbox" as an Example

This is a Directory site template built with EdgeOne Pages and the Raindrop.io API. This example uses the theme "Indie Developers' Toolbox for Going Global" to demonstrate how to quickly build a beautiful and practical Directory website.

## Features

- 🎨 Modern UI design with light/dark mode support
- 🏷️ Smart, tag-based categorization system
- 🔍 Powerful fuzzy search functionality
- 📱 Fully responsive design
- ⚡ High-performance architecture based on Next.js
- 🔄 Real-time data synchronization (via Raindrop.io)

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=directory)

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

## Getting Started

### 1. Set up Raindrop.io

1.  Create an account on [Raindrop.io](https://raindrop.io).
2.  Visit the [Integrations settings page](https://app.raindrop.io/settings/integrations) to create an application.
3.  Generate and copy the API token.
4.  Create a `.env.local` file in the project's root directory and add the token:

    ```
    NEXT_PUBLIC_RAINDROP_API_TOKEN=your_raindrop_api_token_here
    ```

    You can use the `.env.local.example` file as a template.

### 2. Add Your Navigation Content

1.  Add bookmarks in Raindrop.io.
2.  Add appropriate tags to each bookmark for categorization.
3.  Add descriptions and notes to provide more context.
4.  Optional: Customize cover images.

### 3. Local Development

```bash
# Install dependencies
npm install
# or
yarn
# or
pnpm install
# or
bun install

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your navigation site.

## Customizing the Theme

This project uses Tailwind CSS for styling. You can customize the theme by modifying the following files:

- `app/globals.css` - Global styles
- `components/Base.tsx` - Main layout component
- `components/common/*` - Common components

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Raindrop.io API Documentation](https://developer.raindrop.io)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
