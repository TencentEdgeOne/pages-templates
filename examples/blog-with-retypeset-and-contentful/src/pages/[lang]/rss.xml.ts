import type { APIContext } from 'astro'
import { moreLocales } from '@/config'
import { generateRSS } from '@/utils/rss'

export function getStaticPaths() {
  return moreLocales.map(lang => ({
    params: { lang },
  }))
}

export async function GET({ params }: APIContext) {
  const lang = params.lang as typeof moreLocales[number]
  return generateRSS({ lang })
}
