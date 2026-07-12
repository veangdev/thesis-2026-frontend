/**
 * Gender is a self-reported user attribute used for roster breakdowns
 * (e.g. Assessments by Batch). Optional on every user.
 */

export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
} as const

export type Gender = (typeof GENDERS)[keyof typeof GENDERS]

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
}

export const GENDER_BADGE_CLASSES: Record<Gender, string> = {
  male: 'bg-brand-navy/15 text-brand-navy',
  female: 'bg-brand-gold/15 text-brand-gold',
}
