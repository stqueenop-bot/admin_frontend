import { NextResponse, type NextRequest } from 'next/server'
export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  const role = request.cookies.get('admin_role')?.value
  const { pathname } = request.nextUrl

  // Define paths that don't require authentication
  const isLoginPage = pathname === '/login'
  const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next')

  // 1. If trying to access login page while already authenticated, redirect to dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. If trying to access protected pages without session, redirect to login
  if (!session && !isLoginPage && !isPublicFile && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. Role-based access control
  const adminOnlyPaths = ['/dashboard/banners', '/dashboard/access-control', '/dashboard/api-manager']
  if (adminOnlyPaths.some(path => pathname.startsWith(path)) && role?.toUpperCase() !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
