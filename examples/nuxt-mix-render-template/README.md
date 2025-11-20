# Nuxt.js Hybrid Rendering Example Project

🚀 A complete Nuxt.js hybrid rendering example project showcasing the practical applications and best practices of SSG, ISR, and SSR rendering modes.

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=nuxt-mix-render-template)

## ✨ Project Features

- 🎯 **Three Rendering Mode Demos**: Complete examples of SSG, ISR, and SSR
- 📱 **Responsive Design**: Perfect adaptation for desktop and mobile
- 🔧 **TypeScript Support**: Complete type-safe development experience
- 📊 **Real-time Data Display**: Dynamic data and real-time updates on SSR pages
- 🔄 **Incremental Updates**: Smart caching and on-demand updates for ISR pages

## 🏗️ Project Structure

```
├── app/
│   └── app.vue                 # Application entry point
├── assets/
│   └── css/
│       └── main.css           # Main stylesheet (Nuxt green theme)
├── layouts/
│   └── default.vue            # Default layout
├── pages/
│   ├── index.vue              # Home page (SSG)
│   ├── ssg.vue                # SSG example page
│   ├── isr.vue                # ISR example page
│   └── ssr.vue                # SSR example page
├── server/
│   └── api/
│       ├── ssr-data.ts        # SSR dynamic data API
│       └── isr-content.ts     # ISR content API
├── nuxt.config.ts             # Nuxt configuration (hybrid rendering rules)
└── package.json
```

## 🎯 Rendering Mode Comparison

| Feature | SSG | ISR | SSR |
|---------|-----|-----|-----|
| **First Load** | ⚡ Extremely Fast (<100ms) | 🚀 Fast (~120ms) | 📊 Medium (~300ms) |
| **Content Freshness** | 🔄 Requires Rebuild | ✅ Auto Update | ✅ Real-time |
| **Server Load** | ✅ None | 📉 Low | 📈 High |
| **SEO Friendly** | ✅ Perfect | ✅ Perfect | ✅ Good |
| **Use Cases** | Docs, Corporate | Blog, E-commerce | Dashboard, Social |

## 🚀 Quick Start

### Requirements

- Node.js 18+ 
- npm / yarn / pnpm

### Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Development Environment

Start the development server at `http://localhost:3000`:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

### Production Build

```bash
# Build application
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

## 📖 Page Descriptions

### 🏠 Home Page (/)
- **Rendering Mode**: SSG (Static Site Generation)
- **Features**: Generated at build time, fastest loading speed
- **Content**: Project introduction, tech stack showcase, quick start guide

### ⚡ SSG Example (/ssg)
- **Rendering Mode**: SSG (Static Site Generation)
- **Features**: Demonstrates SSG principles, performance advantages and configuration methods
- **Content**: Technical principles, performance comparison, use cases, code examples

### 🔄 ISR Example (/isr)
- **Rendering Mode**: ISR (Incremental Static Regeneration)
- **Features**: Combines advantages of static generation and dynamic updates
- **Content**: Real-time content display, working principles, configuration examples, advantage comparison

### 🚀 SSR Example (/ssr)
- **Rendering Mode**: SSR (Server-Side Rendering)
- **Features**: Real-time data, dynamic content, personalized experience
- **Content**: Real-time dashboard, user activity, system status, API call demonstrations

## ⚙️ Configuration

### Nuxt Configuration (nuxt.config.ts)

```typescript
export default defineNuxtConfig({
  // CSS Configuration
  css: ['~/assets/css/main.css'],
  
  // Hybrid Rendering Route Rules
  routeRules: {
    '/ssg': { prerender: true },     // SSG - Static Generation
    '/isr': { isr: true },           // ISR - Incremental Static Regeneration
    '/ssr': { ssr: true }            // SSR - Server-Side Rendering
  },
  
  // TypeScript Configuration
  typescript: {
    strict: true,
    typeCheck: true
  }
})
```

### API Routes

#### `/api/ssr-data` - SSR Dynamic Data
- Provides real-time statistics
- User activity information
- System status monitoring
- Regenerated on every request

#### `/api/isr-content` - ISR Content Data
- Article lists
- Product information
- Statistics data
- Periodically updated with smart caching

## 🎨 Style System

The project uses a complete design system based on Nuxt's official green theme:

- **Primary Color**: `#00DC82` (Nuxt Green)
- **CSS Variables**: Unified color, spacing, and shadow system
- **Responsive Design**: Mobile-first layout strategy
- **Component Styles**: Cards, buttons, badges and other common components

## 📊 Performance Optimization

### SSG Optimization
- Pre-generate all pages at build time
- Static asset CDN distribution
- Image lazy loading and optimization
- CSS/JS code splitting

### ISR Optimization
- Smart caching strategies
- On-demand regeneration
- Background update mechanisms
- Cache invalidation control

### SSR Optimization
- Server-side data prefetching
- Client-side hydration optimization
- API response caching
- Component-level caching

## 🚀 Deployment Guide

### Static Deployment (SSG)
Suitable for Netlify, Vercel, GitHub Pages and other static hosting services:

```bash
npm run generate
```

### Server Deployment (Hybrid Rendering)
Suitable for Node.js-supported server environments:

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Framework**: [Nuxt.js 4.1.3](https://nuxt.com/)
- **Frontend**: [Vue.js 3.5.22](https://vuejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Native CSS + CSS Variables

## 📚 Learning Resources

- [Nuxt.js Official Documentation](https://nuxt.com/docs)
- [Vue.js Official Documentation](https://vuejs.org/guide/)
- [Rendering Mode Comparison](https://nuxt.com/docs/guide/concepts/rendering)
- [Hybrid Rendering Configuration](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nuxt.js](https://nuxt.com/) - Excellent full-stack Vue framework
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- All developers who contribute to the open source community