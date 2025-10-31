import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 简单的中间件，不做任何重定向
  return NextResponse.next()
}

export const config = {
  matcher: [
    // 匹配所有路径，除了API和静态文件
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}