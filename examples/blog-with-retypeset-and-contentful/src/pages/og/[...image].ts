import type { CollectionEntry } from 'astro:content'
import { getPosts } from '@/utils/content';
import { generateDescription } from '@/utils/description'
import { OGImageRoute } from 'astro-og-canvas'

// eslint-disable-next-line antfu/no-top-level-await
const blogEntries = await getPosts();

// Convert blog entries into a lookup object with slug as key and title/description as value
const pages = Object.fromEntries(
  blogEntries.map((post: CollectionEntry<'posts'>) => [
    post.slug,
    {
      title: post.data.title,
      description: post.data.description || generateDescription(post, 'og'),
    },
  ]),
)

// Configure Open Graph image generation route
export const { getStaticPaths, GET } = OGImageRoute({
  param: 'image',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/icon/og-logo.png', // Required local path and PNG format
      size: [250],
    },
    border: {
      color: [242, 241, 245],
      width: 20,
    },
    font: {
      title: {
        families: ['Noto Sans SC'], // or Noto Serif SC
        weight: 'Bold',
        color: [34, 33, 36],
        lineHeight: 1.5,
      },
      description: {
        families: ['Noto Sans SC'], // or Noto Serif SC
        color: [72, 71, 74],
        lineHeight: 1.5,
      },
    },
    fonts: [
      'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/SubsetOTF/SC/NotoSansSC-Bold.otf',
      'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf',
      // 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/SubsetOTF/SC/NotoSerifSC-Bold.otf',
      // 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/SubsetOTF/SC/NotoSerifSC-Regular.otf',
    ],
    bgGradient: [[242, 241, 245]],
  }),
})
