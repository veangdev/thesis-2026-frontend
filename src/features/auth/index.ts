import { mockAuthService } from '@/mocks/services/auth.mock'
import { pickService } from '@/services/service-factory'
import { realAuthService } from './auth.service'

export const authService = pickService(realAuthService, mockAuthService)

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
