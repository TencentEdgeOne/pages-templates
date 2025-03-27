import { allLocales } from '@/config'
import { defineCollection, z } from 'astro:content'

// About Page
const aboutCollection = defineCollection({
  schema: z.object({
    lang: z.enum(['', ...allLocales]).optional().default(''),
  }),
})

export const collections = {
  about: aboutCollection,
}
