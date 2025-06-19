import type { CollectionEntry } from 'astro:content'
import { defaultLocale, themeConfig } from '@/config'
import { ui } from '@/i18n/ui'
import { generateDescription } from '@/utils/description'
import rss from '@astrojs/rss'
import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'
import { getPosts } from './content'

const parser = new MarkdownIt()
const { title, description, url } = themeConfig.site
const followConfig = themeConfig.seo?.follow

interface GenerateRSSOptions {
  lang?: string
}

export async function generateRSS({ lang }: GenerateRSSOptions = {}) {
  const currentUI = ui[lang as keyof typeof ui] || ui[defaultLocale as keyof typeof ui]
  const siteTitle = themeConfig.site.i18nTitle ? currentUI.title : title
  const siteDescription = themeConfig.site.i18nTitle ? currentUI.description : description
  // Get posts for specific language (including universal posts and default language when lang is undefined)
  const posts = await getPosts(lang);
  console.warn('siteTitle', posts);

  return rss({
    title: siteTitle,
    site: lang ? `${url}/${lang}` : url,
    description: siteDescription,
    stylesheet: '/rss/rss-style.min.xsl',
    customData: `
    <copyright>Copyright © ${new Date().getFullYear()} ${themeConfig.site.author}</copyright>
    <language>${lang || themeConfig.global.locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${followConfig?.feedID && followConfig?.userID
        ? `<follow_challenge>
          <feedId>${followConfig.feedID}</feedId>
          <userId>${followConfig.userID}</userId>
        </follow_challenge>`
        : ''
    }
  `.trim(),
    items: posts.map((post: CollectionEntry<'posts'>) => ({
      title: post.data.title,
      // Generate URL with language prefix and abbrlink/slug
      link: new URL(
        `${post.data.lang !== defaultLocale && post.data.lang !== '' ? `${post.data.lang}/` : ''}posts/${post.data.abbrlink || post.slug}/`,
        url,
      ).toString(),
      description: generateDescription(post, 'rss'),
      pubDate: post.data.published,
      content: post.body
        ? sanitizeHtml(parser.render(post.body), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          })
        : '',
    })),
  })
}
