import { mockAuthService } from '@/mocks/services/auth.mock'
import { pickService } from '@/services/service-factory'
import { realAuthService } from './auth.service'
<<<<<<< HEAD

export const authService = pickService(realAuthService, mockAuthService)
=======
import type { AuthService } from './auth.contract'

/**
 * Resolves to the real NestJS API by default, or the in-memory mock when
 * `NEXT_PUBLIC_USE_MOCKS=true` (e.g. the e2e suite) — matching every other
 * feature. The authenticated user's id flows through to every feature in both
 * modes.
 */
export const authService: AuthService = pickService(
  realAuthService,
  mockAuthService
)
>>>>>>> origin/main

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
