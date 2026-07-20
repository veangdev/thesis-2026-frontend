import type { Permission, Role } from '@/constants/roles'

export type { Permission, Role }

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  /** Cohort the user belongs to (self-assessors) or coordinates. */
  cohortId?: string
  /** Cohort display name, sent alongside `cohortId` by the API. */
  cohortName?: string
  /** Assigned facilitator (self-assessors only). */
  facilitatorId?: string
  /** Coaching strengths shown on a facilitator's profile. */
  expertiseTags?: string[]
  /** Days a facilitator is free to coach, as YYYY-MM-DD. */
  availability?: string[]
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface Session {
  user: User
  permissions: Permission[]
  expiresAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  password: string
}

export interface ResetPasswordPayload {
  email: string
  /** 6-digit code emailed by /auth/forgot-password. */
  otp: string
  password: string
}
