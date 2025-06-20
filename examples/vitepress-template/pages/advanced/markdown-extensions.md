# Markdown Extensions

VitePress extends standard Markdown with powerful features to enhance your documentation.

## Built-in Extensions

### Syntax Highlighting

VitePress uses [Shiki](https://github.com/shikijs/shiki) for syntax highlighting with additional features:

```js{4}
export default {
  data() {
    return {
      message: 'Highlighted line!'
    }
  }
}
```

### Line Numbers

Add line numbers to code blocks:

```js{1,3}
function hello() {
  console.log('Hello, World!')
  return 'Hello'
}
```

### Line Highlighting

Highlight specific lines:

```js{2,4-6}
export default {
  name: 'MyComponent',
  props: {
    title: String,
    description: String,
    author: String
  },
  methods: {
    handleClick() {
      // Handle click event
    }
  }
}
```

## Custom Containers

### Info Container

::: info
This is an informational note. Use it to provide additional context or helpful tips.
:::

### Tip Container

::: tip
This is a tip. Use it to share best practices or helpful suggestions.
:::

### Warning Container

::: warning
This is a warning. Use it to alert users about potential issues or important considerations.
:::

### Danger Container

::: danger
This is a danger warning. Use it to highlight critical information or potential problems.
:::

### Details Container

::: details Click to expand
This content is hidden by default and can be expanded by clicking the summary.
:::

## Advanced Features

### Import Code Blocks

Import code from external files:

```js
// Import code from external files
// Example: <<< @/components/Example.vue
```

### Partial Imports

Import specific parts of a file using VS Code regions:

```js
// Import specific parts of a file
// Example: <<< @/components/Example.vue{1-10}
```

### Inline Code with Language

Specify language for inline code: `const message = 'Hello'`{lang=js}

### Emojis

VitePress supports emojis: 🎉 ✨ 🚀 💡

### Mathematical Expressions

Inline math: $E = mc^2$

Block math:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Custom Containers

You can create custom containers with your own styling:

::: custom-container
**Custom Container**
This is a custom container with your own styling.
:::

<style>
.custom-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin: 16px 0;
}
</style>

## Code Groups

Group multiple code blocks with tabs:

::: code-group

```js [config.js]
export default {
  title: 'My Site',
  description: 'My awesome site'
}
```

```ts [config.ts]
export default {
  title: 'My Site',
  description: 'My awesome site'
} as const
```

:::

## File Trees

Display file structures:

```
root/
├── .vitepress/
│   ├── config.ts
│   └── theme/
│       └── index.ts
├── docs/
│   ├── index.md
│   └── guide/
│       └── getting-started.md
└── package.json
```

## Tables

Enhanced table support:

| Feature | Support | Notes |
|---------|---------|-------|
| Syntax Highlighting | ✅ | Powered by Shiki |
| Custom Containers | ✅ | Built-in and custom |
| Math Expressions | ✅ | KaTeX support |
| Code Groups | ✅ | Tabbed code blocks |
| File Trees | ✅ | Tree structure display |

## Lists

### Task Lists

- [x] Create documentation
- [x] Add examples
- [ ] Deploy to production
- [ ] Add analytics

### Nested Lists

1. First level
   - Second level
     - Third level
       - Fourth level
2. Back to first level

## Links

### Internal Links

- [Home](/)
- [Quick Start](/quick-start)
- [API Examples](/api-examples)

### External Links

- [VitePress Documentation](https://vitepress.dev/)
- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)

### Link with Title

[VitePress](https://vitepress.dev/ "Static Site Generator")

## Best Practices

### Code Blocks

- Always specify the language for syntax highlighting
- Use line highlighting for important code sections
- Keep code examples concise and focused

### Containers

- Use appropriate container types for different content
- Keep container content relevant and concise
- Use custom containers sparingly

### Links

- Use descriptive link text
- Provide titles for external links
- Test all internal links regularly

### Content Organization

- Use clear headings and subheadings
- Group related content together
- Keep paragraphs short and readable 