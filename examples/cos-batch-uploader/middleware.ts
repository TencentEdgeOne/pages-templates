import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Simple middleware, no redirects
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except API and static files
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}