# Quick Start

This page demonstrates how to get started with VitePress and includes examples of nested navigation structure.

## Getting Started

### Installation

First, install VitePress in your project:

```bash
npm install -D vitepress
```

### Basic Setup

Create your first documentation page:

```bash
mkdir docs
echo '# Hello VitePress' > docs/index.md
```

### Configuration

Create a basic configuration file:

```js
// .vitepress/config.js
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My Docs',
  description: 'My documentation site'
})
```

## Advanced Features

### Custom Theme

You can customize the theme by creating your own theme files:

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

### Markdown Extensions

VitePress supports various markdown extensions:

::: tip
This is a tip box
:::

::: warning
This is a warning box
:::

::: danger
This is a danger box
:::

### Code Highlighting

VitePress provides excellent syntax highlighting:

```js
function hello() {
  console.log('Hello, VitePress!')
}
```

```css
.custom-style {
  color: #42b883;
  font-weight: bold;
}
```

## Deployment

### Build for Production

```bash
npm run docs:build
```

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to GitHub Actions
4. Create deployment workflow

### Netlify Deployment

1. Connect your repository to Netlify
2. Set build command: `npm run docs:build`
3. Set publish directory: `docs/.vitepress/dist`

## Best Practices

### File Organization

Organize your documentation with a clear structure:

```
docs/
├── guide/
│   ├── getting-started.md
│   ├── installation.md
│   └── configuration.md
├── reference/
│   ├── config.md
│   └── theme.md
└── index.md
```

### Navigation Structure

Use clear and logical navigation:

- Group related pages together
- Use descriptive titles
- Keep navigation depth reasonable (2-3 levels max)

### Content Guidelines

- Write clear, concise content
- Use code examples where helpful
- Include screenshots for complex features
- Keep pages focused on a single topic 