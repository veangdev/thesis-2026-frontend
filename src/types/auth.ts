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
  /** Assigned facilitator (self-assessors only). */
  facilitatorId?: string
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

export interface ResetPasswordPayload {
  email: string
  /** 6-digit code emailed by /auth/forgot-password. */
  otp: string
  password: string
}
