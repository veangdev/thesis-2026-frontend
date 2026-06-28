/**
 * Centralized route table. Import these instead of hard-coding path strings
 * so links stay refactor-safe and the proxy/guards share one source of truth.
 */
export const ROUTES = {
  home: '/',

  // Dashboard area.
  dashboard: '/dashboard',
  journeyStar: '/journey-star',
  goals: '/goals',
  coaching: '/coaching',
  reports: '/reports',
  users: '/users',

  // Auth (prepared for when the backend is ready — not yet wired into the UI).
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
} as const

/** Routes that never require authentication. */
export const PUBLIC_ROUTES: string[] = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
]

/** Routes that will require authentication once enforcement is enabled. */
export const PROTECTED_ROUTES: string[] = [
  ROUTES.dashboard,
  ROUTES.journeyStar,
  ROUTES.goals,
  ROUTES.coaching,
  ROUTES.reports,
  ROUTES.users,
]

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
