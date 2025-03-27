import { moreLocales } from '@/config'
import { getLangFromPath } from '@/i18n/lang'
import { getLocalizedPath } from '@/i18n/path'

// Removes leading and trailing slashes from a path
export function cleanPath(path: string) {
  return path.replace(/^\/|\/$/g, '')
}

// Checks if the current path is the home/post/tag/about page
export function isHomePage(path: string) {
  const clean = cleanPath(path)
  return clean === '' || moreLocales.includes(clean)
}
export function isPostPage(path: string) {
  const clean = cleanPath(path)
  return clean.startsWith('posts') || moreLocales.some(lang => clean.startsWith(`${lang}/posts`))
}
export function isTagPage(path: string) {
  const clean = cleanPath(path)
  return clean.startsWith('tags') || moreLocales.some(lang => clean.startsWith(`${lang}/tags`))
}
export function isAboutPage(path: string) {
  const clean = cleanPath(path)
  return clean.startsWith('about') || moreLocales.some(lang => clean.startsWith(`${lang}/about`))
}

// Returns page context including language and page type information
export function getPageInfo(path: string) {
  const currentLang = getLangFromPath(path)

  return {
    currentLang,
    isHome: isHomePage(path),
    isPost: isPostPage(path),
    isTag: isTagPage(path),
    isAbout: isAboutPage(path),
    getLocalizedPath: (targetPath: string) => getLocalizedPath(targetPath, currentLang),
  }
}
