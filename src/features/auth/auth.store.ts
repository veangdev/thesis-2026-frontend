import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthStore } from './auth.types'

/**
 * Placeholder auth store. It holds the current user in memory (persisted to
 * localStorage) and is the single source of truth the guards read from. It is
 * NOT populated automatically yet — the login flow will call `setUser` once the
 * backend is connected.
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
      partialize: (state) => ({
        user: state.user,
        status: state.status,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
