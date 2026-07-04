/**
 * Roles and permissions. This is the foundation for role-based access control;
 * enforcement lives in `src/proxy.ts` and the auth guards.
 *
 * Role values match the backend API contract exactly (see
 * docs/journey-star-frontend-prompt.md §3).
 */

export const ROLES = {
  PROGRAM_COORDINATOR: 'program_coordinator',
  FACILITATOR: 'facilitator',
  SELF_ASSESSOR: 'self_assessor',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  program_coordinator: 'Program Coordinator',
  facilitator: 'Facilitator',
  self_assessor: 'Self-Assessor',
}

/** Tailwind classes (token-based) for role chips/badges. */
export const ROLE_BADGE_CLASSES: Record<Role, string> = {
  program_coordinator: 'bg-brand-navy/15 text-brand-navy',
  facilitator: 'bg-brand-emerald/15 text-brand-emerald',
  self_assessor: 'bg-brand-gold/15 text-brand-gold',
}

export const PERMISSIONS = {
  ASSESSMENT_SELF_SUBMIT: 'assessment:self:submit',
  ASSESSMENT_MENTOR_EVALUATE: 'assessment:mentor:evaluate',
  ASSESSMENT_VIEW_ALL: 'assessment:view:all',
  USER_MANAGE: 'user:manage',
  COHORT_MANAGE: 'cohort:manage',
  PERIOD_MANAGE: 'period:manage',
  DIMENSION_MANAGE: 'dimension:manage',
  ASSIGNMENT_MANAGE: 'assignment:manage',
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',
  COACHING_MANAGE: 'coaching:manage',
  AUDIT_VIEW: 'audit:view',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/** Default permission matrix per role. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  program_coordinator: [
    PERMISSIONS.ASSESSMENT_VIEW_ALL,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.COHORT_MANAGE,
    PERMISSIONS.PERIOD_MANAGE,
    PERMISSIONS.DIMENSION_MANAGE,
    PERMISSIONS.ASSIGNMENT_MANAGE,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.COACHING_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
  ],
  facilitator: [
    PERMISSIONS.ASSESSMENT_MENTOR_EVALUATE,
    PERMISSIONS.COACHING_MANAGE,
    PERMISSIONS.REPORT_VIEW,
  ],
  self_assessor: [PERMISSIONS.ASSESSMENT_SELF_SUBMIT, PERMISSIONS.REPORT_VIEW],
}
