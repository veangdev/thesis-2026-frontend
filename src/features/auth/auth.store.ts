import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ROLES } from '@/constants/roles'
import type { AuthStore } from './auth.types'

const VALID_ROLES = Object.values(ROLES) as string[]

/**
 * Auth store. Holds the current user (persisted to localStorage) and is the
 * single source of truth the guards read from. Populated by the login flow
 * and re-hydrated from `GET /auth/me` by the AuthProvider on load.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      status: 'unauthenticated',
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, status: 'authenticated', isAuthenticated: true }),
      setStatus: (status) => set({ status }),
      clear: () =>
        set({ user: null, status: 'unauthenticated', isAuthenticated: false }),
    }),
    {
      name: 'pnc-auth',
      version: 1,
      // v0 stored users with legacy roles (STUDENT/MENTOR/MANAGER); drop them
      // so role lookups never see an unknown value.
      migrate: (persisted) => {
        const state = persisted as Partial<AuthStore> | undefined
        if (state?.user && !VALID_ROLES.includes(state.user.role)) {
          return {
            user: null,
            status: 'unauthenticated' as const,
            isAuthenticated: false,
          }
        }
        return state as AuthStore
      },
      partialize: (state) => ({
        user: state.user,
        status: state.status,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
