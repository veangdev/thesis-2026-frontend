import type { Permission, Role, User } from '@/types/auth'

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'

export interface AuthState {
  user: User | null
  status: AuthStatus
  /** Derived convenience flag. */
  isAuthenticated: boolean
}

export interface AuthActions {
  setUser: (user: User) => void
  setStatus: (status: AuthStatus) => void
  clear: () => void
}

export type AuthStore = AuthState & AuthActions

export interface RoleGuardProps {
  /** Roles allowed to see the children. */
  allow: Role | Role[]
  /** Optional permissions required (all must be present). */
  requirePermissions?: Permission[]
  children: React.ReactNode
  /** Rendered when access is denied. Defaults to null. */
  fallback?: React.ReactNode
}
