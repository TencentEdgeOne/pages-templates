import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  // 检查 URL 路径中的语言
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 如果路径中没有语言，直接返回默认语言
  if (pathnameIsMissingLocale) {
    return defaultLocale
  }

  // 从路径中提取语言
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 跳过 API 路由、静态文件和内部路径
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 检查路径是否已经包含支持的语言
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 如果路径缺少语言，重定向到带语言的路径
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 匹配所有路径，除了以下路径：
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}