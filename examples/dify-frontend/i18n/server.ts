import 'server-only'

import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import type { Locale } from '.'
import { i18n } from '.'

export const getLocaleOnServer = async (): Promise<Locale> => {
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  let languages: string[] | undefined
  // get locale from cookie
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('locale')
  languages = localeCookie?.value ? [localeCookie.value] : []

  if (!languages.length) {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {}
    const headerStore = await headers()
    headerStore.forEach((value, key) => (negotiatorHeaders[key] = value))
    // Use negotiator and intl-localematcher to get best locale
    languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    // Filter out wildcards and invalid locale strings that cause RangeError
    languages = languages.filter(lang => lang !== '*' && /^[a-zA-Z]{2,}/.test(lang))
  }

  if (!languages || !languages.length) {
    return i18n.defaultLocale as Locale
  }

  // match locale
  try {
    const matchedLocale = match(languages, locales, i18n.defaultLocale) as Locale
    return matchedLocale
  }
  catch {
    return i18n.defaultLocale as Locale
  }
}
