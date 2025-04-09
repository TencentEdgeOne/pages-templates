import type { CollectionEntry } from 'astro:content'
import { defaultLocale } from '@/config'
import MarkdownIt from 'markdown-it'

type ExcerptScene = 'list' | 'meta' | 'og' | 'rss'

const parser = new MarkdownIt()
const isCJKLang = (lang: string) => ['zh', 'zh-tw', 'ja'].includes(lang)

// Excerpt length in different scenarios
const EXCERPT_LENGTHS: Record<ExcerptScene, {
  cjk: number
  other: number
}> = {
  list: {
    cjk: 240,
    other: 240,
  },
  meta: {
    cjk: 120,
    other: 240,
  },
  og: {
    cjk: 70,
    other: 140,
  },
  rss: {
    cjk: 70,
    other: 140,
  },
}

// Generate an excerpt from Markdown content
export function generateExcerpt(
  content: string,
  scene: ExcerptScene,
  lang: string,
): string {
  if (!content)
    return ''

  const length = isCJKLang(lang)
    ? EXCERPT_LENGTHS[scene].cjk
    : EXCERPT_LENGTHS[scene].other

  // Remove all HTML tags and decode HTML entities
  const plainText = parser.render(content)
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&nbsp;/g, ' ')

  // Replace line breaks with spaces
  const normalizedText = plainText.replace(/\s+/g, ' ')
  const excerpt = normalizedText.slice(0, length).trim()
  // Add ellipsis if text was truncated
  return normalizedText.length > length ? `${excerpt}...` : excerpt
}

// Automatically generate a description for the article
export function generateDescription(
  post: CollectionEntry<'posts'>,
  scene: ExcerptScene,
): string {
  // If the article already has a description, return it directly
  if (post.data.description)
    return post.data.description

  const lang = (!post.data.lang || post.data.lang === '') ? defaultLocale : post.data.lang
  return generateExcerpt(post.body, scene, lang)
}
