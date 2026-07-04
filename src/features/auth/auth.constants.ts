import type { Role } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

/** Query keys and defaults for the auth feature. */
export const AUTH_QUERY_KEYS = {
  session: ['auth', 'session'] as const,
  me: ['auth', 'me'] as const,
}

/** Where to send users after auth state changes (single source of truth). */
export const AUTH_REDIRECTS = {
  afterLogout: ROUTES.login,
  whenUnauthenticated: ROUTES.login,
} as const

/**
 * Post-login landing route per role. All roles currently share `/dashboard`
 * (content is role-conditional); kept role-aware so portals can diverge later.
 */
export const POST_LOGIN_ROUTES: Record<Role, string> = {
  program_coordinator: ROUTES.dashboard,
  facilitator: ROUTES.dashboard,
  self_assessor: ROUTES.dashboard,
}

export function getPostLoginRoute(role: Role): string {
  return POST_LOGIN_ROUTES[role] ?? ROUTES.dashboard
}
