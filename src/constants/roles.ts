/**
 * Roles and permissions. This is the foundation for role-based access control;
 * it is intentionally not enforced yet (see `src/proxy.ts` and the auth guards).
 */

export const ROLES = {
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
  MANAGER: 'MANAGER',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: 'Student',
  MENTOR: 'Mentor',
  MANAGER: 'Manager',
}

/** Tailwind classes (token-based) for role chips/badges. */
export const ROLE_BADGE_CLASSES: Record<Role, string> = {
  STUDENT: 'bg-brand-gold/15 text-brand-gold',
  MENTOR: 'bg-brand-emerald/15 text-brand-emerald',
  MANAGER: 'bg-brand-navy/15 text-brand-navy',
}

export const PERMISSIONS = {
  ASSESSMENT_SELF_SUBMIT: 'assessment:self:submit',
  ASSESSMENT_MENTOR_EVALUATE: 'assessment:mentor:evaluate',
  ASSESSMENT_VIEW_ALL: 'assessment:view:all',
  USER_MANAGE: 'user:manage',
  REPORT_VIEW: 'report:view',
  COACHING_MANAGE: 'coaching:manage',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/** Default permission matrix per role. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  STUDENT: [PERMISSIONS.ASSESSMENT_SELF_SUBMIT, PERMISSIONS.REPORT_VIEW],
  MENTOR: [
    PERMISSIONS.ASSESSMENT_MENTOR_EVALUATE,
    PERMISSIONS.COACHING_MANAGE,
    PERMISSIONS.REPORT_VIEW,
  ],
  MANAGER: [
    PERMISSIONS.ASSESSMENT_VIEW_ALL,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.REPORT_VIEW,
  ],
}
