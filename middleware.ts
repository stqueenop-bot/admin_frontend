import { NextResponse, type NextRequest } from 'next/server'
export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  const { pathname } = request.nextUrl

  // Define paths that don't require authentication
  const isLoginPage = pathname === '/login'
  const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next')

  // 1. If trying to access login page while already authenticated, redirect to dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. If trying to access protected pages without session, redirect to login
  // We except the login page itself and static files
  if (!session && !isLoginPage && !isPublicFile && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
