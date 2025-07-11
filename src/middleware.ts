import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const token = req.auth
  const { pathname } = req.nextUrl

  // Public routes
  const publicRoutes = [
    '/',
    '/activities',
    '/about',
    '/contact',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/unauthorized',
  ]

  // API routes that are public
  const publicApiRoutes = [
    '/api/auth',
    '/api/activities',
    '/api/health',
  ]

  // Check if route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Require authentication for all other routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (token.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Provider routes
  if (pathname.startsWith('/provider')) {
    if (token.user?.role !== 'PROVIDER' && token.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // API routes protection
  if (pathname.startsWith('/api/admin')) {
    if (token.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }

  if (pathname.startsWith('/api/provider')) {
    if (token.user?.role !== 'PROVIDER' && token.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}