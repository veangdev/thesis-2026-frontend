<<<<<<< HEAD
import type { StudentClass } from '@/constants/classes'
import type { Gender } from '@/constants/genders'
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
  /** Self-reported gender. Optional — not every user has one on file. */
  gender?: Gender
  /** Class (A/B/C) within the cohort/batch. Self-assessors only. */
  studentClass?: StudentClass
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
  token: string
=======
  email: string
  /** 6-digit code emailed by /auth/forgot-password. */
  otp: string
>>>>>>> origin/main
  password: string
}
