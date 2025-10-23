import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['zh', 'en']
const defaultLocale = 'en'

function getPreferredLocale(request: NextRequest): string {
  // 1. 检查 Accept-Language 头部
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // 检查是否包含中文
    if (acceptLanguage.includes('zh')) {
      return 'zh'
    }
    // 检查是否包含英文
    if (acceptLanguage.includes('en')) {
      return 'en'
    }
  }

  // 2. 默认返回中文
  return defaultLocale
}

function hasLocaleInPath(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 跳过 API 路由、静态文件和内部路径
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/icons/') ||
    pathname.includes('.') && !pathname.endsWith('/')
  ) {
    return NextResponse.next()
  }

  // 检查路径是否已经包含支持的语言
  const pathnameHasLocale = hasLocaleInPath(pathname)

  // 如果路径缺少语言前缀，进行重定向
  if (!pathnameHasLocale) {
    // 获取用户首选语言
    const locale = getPreferredLocale(request)
    
    // 构建新的 URL
    let newPathname: string
    
    if (pathname === '/') {
      // 根路径重定向到默认语言首页
      newPathname = `/${locale}`
    } else {
      // 其他路径添加语言前缀
      newPathname = `/${locale}${pathname}`
    }
    
    const newUrl = new URL(newPathname, request.url)
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