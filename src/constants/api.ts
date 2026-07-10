/**
 * API endpoint paths (relative to NEXT_PUBLIC_API_BASE_URL).
 * Mirrors the backend contract in docs/journey-star-frontend-prompt.md §3.
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
  users: {
    root: '/users',
    byId: (id: string) => `/users/${id}`,
    bulk: '/users/bulk',
  },
  cohorts: {
    root: '/cohorts',
    byId: (id: string) => `/cohorts/${id}`,
    dimensions: (id: string) => `/cohorts/${id}/dimensions`,
    periods: (id: string) => `/cohorts/${id}/periods`,
  },
  dimensions: {
    byId: (id: string) => `/dimensions/${id}`,
  },
  periods: {
    byId: (id: string) => `/periods/${id}`,
  },
  assignments: {
    root: '/assignments',
  },
  facilitators: {
    students: (id: string) => `/facilitators/${id}/students`,
  },
  assessments: {
    root: '/assessments',
    byId: (id: string) => `/assessments/${id}`,
    self: (id: string) => `/assessments/${id}/self`,
    selfSubmit: (id: string) => `/assessments/${id}/self/submit`,
    mentor: (id: string) => `/assessments/${id}/mentor`,
    mentorSubmit: (id: string) => `/assessments/${id}/mentor/submit`,
  },
  analytics: {
    student: (id: string) => `/analytics/student/${id}`,
    cohort: (id: string) => `/analytics/cohort/${id}`,
    overview: '/analytics/overview',
    gap: (assessmentId: string) => `/analytics/gap/${assessmentId}`,
  },
  coachingSessions: {
    root: '/coaching-sessions',
    byId: (id: string) => `/coaching-sessions/${id}`,
    actionItems: (id: string) => `/coaching-sessions/${id}/action-items`,
  },
  actionItems: {
    byId: (id: string) => `/action-items/${id}`,
  },
  goals: {
    root: '/goals',
    byId: (id: string) => `/goals/${id}`,
  },
  notifications: {
    root: '/notifications',
    read: (id: string) => `/notifications/${id}/read`,
    readAll: '/notifications/read-all',
  },
  auditLogs: {
    root: '/audit-logs',
  },
  settings: {
    notificationRules: '/settings/notification-rules',
    notificationRule: (key: string) => `/settings/notification-rules/${key}`,
  },
} as const
