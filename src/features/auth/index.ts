import { realAuthService } from './auth.service'
import type { AuthService } from './auth.contract'

/**
 * The whole app runs against the real NestJS API (`NEXT_PUBLIC_USE_MOCKS=false`),
 * so authentication uses the real service directly and the authenticated user's
 * real backend id flows through to every feature.
 */
export const authService: AuthService = realAuthService

export { useAuthStore } from './auth.store'
export { RequireAuth } from './require-auth'
export { RequireRole } from './require-role'
export {
  AUTH_QUERY_KEYS,
  AUTH_REDIRECTS,
  POST_LOGIN_ROUTES,
  getPostLoginRoute,
} from './auth.constants'
export type { AuthService } from './auth.contract'
export type {
  AuthState,
  AuthActions,
  AuthStore,
  AuthStatus,
  RoleGuardProps,
} from './auth.types'
