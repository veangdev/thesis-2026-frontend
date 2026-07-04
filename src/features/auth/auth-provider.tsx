'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAccessToken, getRefreshToken } from '@/lib/auth'
import { registerUnauthorizedHandler } from '@/services/api-client'
import { AUTH_REDIRECTS } from './auth.constants'
import { useAuthStore } from './auth.store'
import { authService } from './index'

/**
 * Keeps client auth state in sync with the token cookies:
 * - On load, re-hydrates the user from `GET /auth/me` when tokens exist
 *   (the persisted store may be stale or belong to a signed-out session).
 * - Registers the api-client's unauthorized handler so an unrecoverable 401
 *   clears state and lands on the login page with an "expired" hint.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setStatus = useAuthStore((state) => state.setStatus)
  const clear = useAuthStore((state) => state.clear)
  const hydrated = useRef(false)

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clear()
      router.replace(`${AUTH_REDIRECTS.whenUnauthenticated}?expired=1`)
    })
  }, [clear, router])

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true

    const hasTokens = !!getAccessToken() || !!getRefreshToken()
    if (!hasTokens) {
      // No session — make sure any persisted user from a previous session is gone.
      if (useAuthStore.getState().user) clear()
      return
    }

    setStatus('loading')
    authService
      .me()
      .then((user) => setUser(user))
      .catch(() => {
        // Token invalid and refresh failed — the unauthorized handler (above)
        // already redirected if this happened inside the api client.
        clear()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
