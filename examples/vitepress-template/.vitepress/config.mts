import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vitepress-template",
  description: "A starter template for VitePress",
  srcDir: 'pages',
  outDir: 'dist',
  ignoreDeadLinks: true,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: [1, 3],    // 显示 h1 到 h3 级别的标题
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start/quick-start' },
      { text: 'Examples', link: '/examples/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Quick Start',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/quick-start/quick-start' },
          { text: 'Installation', link: '/quick-start/quick-start#installation' },
          { text: 'Basic Setup', link: '/quick-start/quick-start#basic-setup' },
          { text: 'Configuration', link: '/quick-start/quick-start#configuration' }
        ]
      },
      {
        text: 'Advanced',
        collapsed: true,
        items: [
          { text: 'Custom Theme', link: '/advanced/custom-theme' },
          { text: 'Markdown Extensions', link: '/advanced/markdown-extensions' },
          { text: 'Code Highlighting', link: '/advanced/code-highlighting' }
        ]
      },
      {
        text: 'Deployment',
        collapsed: true,
        items: [
          { text: 'Build for Production', link: '/quick-start/quick-start#build-for-production' },
          { text: 'GitHub Pages', link: '/quick-start/quick-start#deploy-to-github-pages' },
          { text: 'Netlify', link: '/quick-start/quick-start#netlify-deployment' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/examples/markdown-examples' },
          { text: 'Runtime API Examples', link: '/examples/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/vitepress-template' }
    ]
  }
})
