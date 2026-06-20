import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PUBLIC_ROUTES, ROUTES } from '@/constants/routes'

/**
 * Next.js 16 Proxy (formerly "middleware").
 *
 * This is the route-protection FOUNDATION. Enforcement is intentionally
 * DISABLED while the landing page acts as a public temporary dashboard and the
 * backend auth API is not ready.
 *
 * To enable optimistic auth gating later, flip `AUTH_ENFORCED` to `true`. The
 * gating logic below is real (no fake auth) — it simply checks for the presence
 * of an access-token cookie and redirects accordingly.
 */
const AUTH_ENFORCED = false

export function proxy(request: NextRequest) {
  if (!AUTH_ENFORCED) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!accessToken && !isPublic) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url))
  }

  if (accessToken && isPublic && pathname !== ROUTES.home) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
