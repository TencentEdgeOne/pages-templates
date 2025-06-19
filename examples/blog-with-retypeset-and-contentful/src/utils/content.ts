import type { CollectionEntry } from 'astro:content'
import { defaultLocale } from '@/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/posts')

// 创建 markdown-it 实例并配置插件
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  breaks: true, // 转换换行符为 <br>
  linkify: true, // 自动转换 URL 为链接
})
// 添加属性支持，允许为元素添加类名等
.use(markdownItAttrs)

// 自定义图片渲染规则
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx]
  const src = token.attrGet('src')
  const alt = token.content || ''
  const title = token.attrGet('title') || alt

  return `<img src="${src}" alt="${alt}" title="${title}" loading="lazy" class="rounded-lg shadow-md hover:shadow-lg transition-shadow" />`
}

// 将 Markdown 转换为 HTML
function convertMarkdownToHtml(content: string): string {
  return md.render(content)
}

// Type definitions
export type Post = CollectionEntry<'posts'> & {
  remarkPluginFrontmatter: {
    minutes: number
  }
}

// Add metadata including reading time to post
async function addMetaToPost(post: CollectionEntry<'posts'>): Promise<Post> {
  const { remarkPluginFrontmatter } = await post.render()
  return { ...post, remarkPluginFrontmatter: remarkPluginFrontmatter as { minutes: number } }
}

/**
 * Read all markdown files from the content directory
 */
async function readMarkdownFiles() {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    const markdownFiles = files.filter(file => file.endsWith('.md'))

    const posts = await Promise.all(
      markdownFiles
        .map(async (file) => {
          const filePath = path.join(CONTENT_DIR, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const { data, content: body } = matter(content);
          // 将 Markdown 转换为 HTML
          const processedBody = convertMarkdownToHtml(body);
          // Extract language from filename (e.g., "my-post-en.md" -> "en")
          const fileNameParts = file.replace('.md', '').split('-');
          const fileLang = fileNameParts[fileNameParts.length - 1];
          return {
            id: file,
            slug: fileNameParts.slice(0, -1).join('-'), // Remove language part from slug
            collection: 'posts',
            data: {
              title: data.title,
              description: data.description,
              published: new Date(data.published),
              updated: new Date(data.updated),
              lang: fileLang,
              tags: data.tags || [],
              draft: data.draft,
              category: data.category,
            },
            body: processedBody,
            render: async () => {
              return {
                remarkPluginFrontmatter: {
                  minutes: Math.ceil(body.length / 1000),
                },
              };
            },
          } as CollectionEntry<'posts'>;
        })
    )
    return posts
  } catch (error) {
    console.error('Error reading markdown files:', error)
    return []
  }
}

/**
 * Get all posts (including drafts in development)
 */
export async function getPosts(lang?: string) {
  const currentLang = lang || defaultLocale
  const posts = await readMarkdownFiles()
  
  const filteredPosts = posts.filter(post => {
    const shouldInclude = import.meta.env.DEV || !post.data.draft
    return shouldInclude && (post.data.lang === currentLang || post.data.lang === '')
  })

  const enhancedPosts = await Promise.all(filteredPosts.map(addMetaToPost))

  return enhancedPosts.sort((a, b) =>
    b.data.published.valueOf() - a.data.published.valueOf()
  )
}

export async function getAllPosts() {
  const posts = await readMarkdownFiles()
  return posts
}
/**
 * Group posts by year and sort within each year
 */
export async function getPostsByYear(lang?: string): Promise<Map<number, Post[]>> {
  const posts = await getPosts(lang)
  const yearMap = new Map<number, Post[]>()

  posts.forEach((post: Post) => {
    const year = post.data.published.getFullYear()
    if (!yearMap.has(year)) {
      yearMap.set(year, [])
    }
    yearMap.get(year)!.push(post)
  })

  yearMap.forEach((yearPosts) => {
    yearPosts.sort((a, b) => {
      const aDate = a.data.published
      const bDate = b.data.published
      return bDate.getMonth() - aDate.getMonth() || bDate.getDate() - aDate.getDate()
    })
  })

  return new Map([...yearMap.entries()].sort((a, b) => b[0] - a[0]))
}

export async function getPinnedPosts(lang?: string) {
  const posts = await getPosts(lang)
  return posts.filter((post) => post.data.pinned)
}
export async function checkPostSlugDuplication(slug: string, lang?: string) {
  const posts = await getPosts(lang)
  return posts.some((post) => post.slug === slug)
}
/**
 * Get all tags sorted by post count
 */
export async function getAllTags(lang?: string) {
  const tagMap = await getPostsGroupByTags(lang)
  const tagsWithCount = Array.from(tagMap.entries())

  tagsWithCount.sort((a, b) => b[1].length - a[1].length)
  return tagsWithCount.map(([tag]) => tag)
}

/**
 * Group posts by their tags
 */
export async function getPostsGroupByTags(lang?: string) {
  const posts = await getPosts(lang)
  const tagMap = new Map<string, Post[]>()

  posts.forEach((post: Post) => {
    post.data.tags?.forEach((tag: string) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [])
      }
      tagMap.get(tag)!.push(post)
    })
  })

  return tagMap
}

/**
 * Get all posts that contain a specific tag
 */
export async function getPostsByTag(tag: string, lang?: string) {
  const tagMap = await getPostsGroupByTags(lang)
  return tagMap.get(tag) || []
}
