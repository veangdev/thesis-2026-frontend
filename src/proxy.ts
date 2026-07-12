import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PROTECTED_ROUTES, PUBLIC_ROUTES, ROUTES } from '@/constants/routes'

/**
 * Next.js 16 Proxy (formerly "middleware").
 *
 * Optimistic auth gating: checks for the presence of an access-token cookie
 * and redirects accordingly. Real authorization happens in the API and the
 * client guards — this only prevents obviously-unauthenticated deep links.
 * Works identically in mock mode (mock login sets a fake cookie).
 */
const AUTH_ENFORCED = true

export function proxy(request: NextRequest) {
  if (!AUTH_ENFORCED) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  // Only guard known protected areas — unknown paths must still 404.
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!accessToken && isProtected) {
    const loginUrl = new URL(ROUTES.login, request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (accessToken && isPublic && pathname !== ROUTES.home) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
