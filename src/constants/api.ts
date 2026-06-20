/**
 * API endpoint paths (relative to NEXT_PUBLIC_API_BASE_URL).
 * Keep every backend path here so they are typed and never hard-coded in
 * components or services.
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  assessments: {
    mine: '/assessments/my',
    pending: '/assessments/pending',
    self: '/assessments/self',
    byId: (id: string) => `/assessments/${id}`,
    mentorEvaluate: (id: string) => `/assessments/${id}/mentor`,
  },
  users: {
    root: '/users',
    byId: (id: string) => `/users/${id}`,
  },
  coaching: {
    root: '/coaching',
    byId: (id: string) => `/coaching/${id}`,
    complete: (id: string) => `/coaching/${id}/complete`,
  },
  goals: {
    mine: '/goals/my',
    root: '/goals',
    byId: (id: string) => `/goals/${id}`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    gaps: '/analytics/gaps',
    reports: '/analytics/reports',
    batches: '/analytics/batches',
  },
} as const
