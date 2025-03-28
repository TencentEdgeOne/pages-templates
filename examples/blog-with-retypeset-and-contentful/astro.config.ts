import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap'
import compress from 'astro-compress'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import UnoCSS from 'unocss/astro'
import { themeConfig } from './src/config'
import { langMap } from './src/i18n/config'
import { remarkReadingTime } from './src/plugins/remark-reading-time'

const url = themeConfig.site.url
const locale = themeConfig.global.locale
const linkPrefetch = themeConfig.preload.linkPrefetch
const imageDomain = new URL(themeConfig.preload.imageHostURL as string).hostname

export default defineConfig({
  site: url,
  base: '/',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: linkPrefetch,
  },
  image: {
    domains: [imageDomain],
    remotePatterns: [{ protocol: 'https' }],
  },
  i18n: {
    locales: Object.entries(langMap).map(([path, codes]) => ({
      path,
      codes: codes as [string, ...string[]],
    })),
    defaultLocale: locale,
  },
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    mdx(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap(),
    robotsTxt(),
    compress(),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
    ],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noopener', 'noreferrer', 'external'],
          protocols: ['http', 'https', 'mailto'],
        },
      ],
    ],
    shikiConfig: {
      // available themes: https://shiki.style/themes
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
})
