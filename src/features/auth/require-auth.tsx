'use client'

import { useEffect, useSyncExternalStore } from 'react'
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
 * The persisted auth store rehydrates ASYNCHRONOUSLY on a hard load, so the
 * guard must wait for hydration before judging the session — otherwise every
 * protected deep link briefly reads as signed-out and bounces via /login,
 * losing the requested path.
 */
export function RequireAuth({
  children,
  redirectTo = AUTH_REDIRECTS.whenUnauthenticated,
}: RequireAuthProps) {
  const router = useRouter()
  const { isAuthenticated, status } = useAuthStore()
  const hydrated = useSyncExternalStore(
    (onHydrated) => useAuthStore.persist.onFinishHydration(onHydrated),
    () => useAuthStore.persist.hasHydrated(),
    () => false
  )

  useEffect(() => {
    if (hydrated && status !== 'loading' && !isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [hydrated, isAuthenticated, status, redirectTo, router])

  if (!isAuthenticated) {
    return <LoadingOverlay label="Checking your session…" />
  }

  return <>{children}</>
}
