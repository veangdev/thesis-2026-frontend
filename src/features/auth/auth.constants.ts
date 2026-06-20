/** Query keys and defaults for the auth feature. */
export const AUTH_QUERY_KEYS = {
  session: ['auth', 'session'] as const,
  me: ['auth', 'me'] as const,
}

/** Where to send users after auth state changes (single source of truth). */
export const AUTH_REDIRECTS = {
  afterLogin: '/dashboard',
  afterLogout: '/login',
  whenUnauthenticated: '/login',
} as const
