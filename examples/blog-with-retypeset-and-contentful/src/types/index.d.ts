import type { supportedLangs } from '@/i18n/config'

type Exclude<T, U> = T extends U ? never : T

export interface ThemeConfig {

  site: {
    title: string
    subtitle: string
    description: string
    i18nTitle: boolean
    author: string
    url: string
    favicon: string
  }

  color: {
    mode: 'light' | 'dark'
    light: {
      primary: string
      secondary: string
      background: string
    }
    dark: {
      primary: string
      secondary: string
      background: string
    }
  }

  global: {
    locale: typeof supportedLangs[number]
    moreLocales: typeof supportedLangs[number][]
    fontStyle: 'sans' | 'serif'
    dateFormat: 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MM-YYYY' | 'MONTH DAY YYYY' | 'DAY MONTH YYYY'
    titleGap: 1 | 2 | 3
  }

  comment: {
    enabled: boolean
    waline?: {
      serverURL?: string
      emoji?: string[]
      search?: boolean
      imageUploader?: boolean
    }
  }

  seo?: {
    twitterID?: string
    verification?: {
      google?: string
      bing?: string
      yandex?: string
      baidu?: string
    }
    googleAnalyticsID?: string
    umamiAnalyticsID?: string
    follow?: {
      feedID?: string
      userID?: string
    }
    apiflashKey?: string
  }

  footer: {
    links: {
      name: string
      url: string
    }[]
    startYear: number
  }

  preload: {
    linkPrefetch: 'hover' | 'tap' | 'viewport' | 'load'
    commentURL?: string
    imageHostURL?: string
    customGoogleAnalyticsJS?: string
    customUmamiAnalyticsJS?: string
  }
}

export default ThemeConfig
