# Custom Theme

Learn how to customize the VitePress theme to match your brand and design requirements.

## Theme Structure

VitePress uses a theme system that allows you to customize the appearance and behavior of your documentation site. The default theme is located in `node_modules/vitepress/dist/client/theme-default/`.

## Creating a Custom Theme

### Basic Theme Setup

Create a theme directory structure:

```
.vitepress/
├── theme/
│   ├── index.ts
│   ├── style.css
│   └── components/
│       └── CustomComponent.vue
└── config.ts
```

### Theme Entry Point

Create `.vitepress/theme/index.ts`:

```ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Override slots here
    })
  },
  enhanceApp({ app }) {
    // Register custom components
    // app.component('MyComponent', MyComponent)
  }
}
```

### Custom Styles

Add your custom CSS in `.vitepress/theme/style.css`:

```css
:root {
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
  --vp-c-brand-dark: #535bf2;
}

/* Custom component styles */
.custom-component {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}
```

## Theme Customization Options

### Colors

You can customize the color scheme by overriding CSS variables:

```css
:root {
  /* Primary brand color */
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
  --vp-c-brand-dark: #535bf2;
  
  /* Background colors */
  --vp-c-bg: #ffffff;
  --vp-c-bg-alt: #f6f6f7;
  
  /* Text colors */
  --vp-c-text-1: #213547;
  --vp-c-text-2: #476582;
  --vp-c-text-3: #8f9198;
}
```

### Typography

Customize fonts and typography:

```css
:root {
  --vp-font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --vp-font-family-mono: 'Fira Code', 'Monaco', 'Consolas', monospace;
}

/* Custom heading styles */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}
```

### Layout Customization

Override layout components:

```ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CustomLayout from './CustomLayout.vue'

export default {
  ...DefaultTheme,
  Layout: () => h(CustomLayout)
}
```

## Advanced Customization

### Custom Components

Create reusable components:

```vue
<!-- Example: .vitepress/theme/components/InfoBox.vue -->
<template>
  <div class="info-box" :class="type">
    <div class="icon">{{ icon }}</div>
    <div class="content">
      <h4>{{ title }}</h4>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'info'
  },
  title: String,
  content: String,
  icon: String
})
</script>

<style scoped>
.info-box {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.info-box.info {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.info-box.warning {
  background: #fff3e0;
  border: 1px solid #ff9800;
}
</style>
```

### Global Components

Register components globally:

```ts
// .vitepress/theme/index.ts
import InfoBox from './components/InfoBox.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('InfoBox', InfoBox)
  }
}
```

## Best Practices

### Performance

- Keep custom CSS minimal and focused
- Use CSS variables for consistent theming
- Avoid heavy JavaScript in theme components

### Accessibility

- Maintain proper color contrast ratios
- Ensure keyboard navigation works
- Test with screen readers

### Responsive Design

- Test on different screen sizes
- Use relative units (rem, em, %)
- Implement mobile-first design

## Examples

Here's an example of how to use custom components in your theme:

```js
// In your Vue component
<template>
  <div class="custom-info-box">
    <div class="icon">💡</div>
    <div class="content">
      <h4>Theme Customization</h4>
      <p>VitePress themes are highly customizable and can be extended with Vue components.</p>
    </div>
  </div>
</template>
```

This demonstrates how custom components can be integrated into your VitePress theme. 