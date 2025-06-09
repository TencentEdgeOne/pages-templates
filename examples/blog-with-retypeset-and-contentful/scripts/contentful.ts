import type { EntryFieldTypes } from 'contentful'
import process from 'node:process'
import * as contentful from 'contentful'
import { loadEnv } from './env'

loadEnv()

const isDev = process.env.DEV === 'true'

// console.log('import.meta.env.CONTENTFUL_SPACE_ID', import.meta.env.CONTENTFUL_SPACE_ID)
// console.log('import.meta.env.CONTENTFUL_DELIVERY_TOKEN', import.meta.env.CONTENTFUL_DELIVERY_TOKEN)
export const getContentfulClient = () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;
  if (!spaceId || !(deliveryToken || previewToken)) {
    return null
  }
  return contentful.createClient({
    space: spaceId,
    accessToken: isDev ? previewToken! : deliveryToken!,
    host: isDev ? 'preview.contentful.com' : 'cdn.contentful.com',
  })
}

export interface Blog {
  contentTypeId: 'blog'
  fields: {
    title: EntryFieldTypes.Text
    content: EntryFieldTypes.RichText
    date: EntryFieldTypes.Date
    description: EntryFieldTypes.Text
    featuredImage: EntryFieldTypes.AssetLink
    slug: EntryFieldTypes.Text
    category: EntryFieldTypes.Text
    author: EntryFieldTypes.Text
    language: EntryFieldTypes.Text
  }
}
