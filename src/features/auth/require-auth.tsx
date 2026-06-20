'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingOverlay } from '@/components/shared/loading-overlay'
import { useAuthStore } from './auth.store'
import { AUTH_REDIRECTS } from './auth.constants'

interface RequireAuthProps {
  children: React.ReactNode
  /** Where to redirect unauthenticated users. */
  redirectTo?: string
}

/**
 * Client-side auth guard. Redirects unauthenticated users to the login page.
 *
 * This is part of the auth FOUNDATION and is intentionally not mounted anywhere
 * yet — protected areas will wrap their content with it once the backend is
 * ready. It contains no fake-auth logic; it only reads real auth state.
 */
export function RequireAuth({
  children,
  redirectTo = AUTH_REDIRECTS.whenUnauthenticated,
}: RequireAuthProps) {
  const router = useRouter()
  const { isAuthenticated, status } = useAuthStore()

  useEffect(() => {
    if (status !== 'loading' && !isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, status, redirectTo, router])

  if (!isAuthenticated) {
    return <LoadingOverlay label="Checking your session…" />
  }

  return <>{children}</>
}
