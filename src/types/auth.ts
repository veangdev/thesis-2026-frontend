import type { Permission, Role } from '@/constants/roles'

export type { Permission, Role }

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  batch?: string
  mentorId?: string
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
  role: Role
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface ResetPasswordPayload {
  token: string
  password: string
}
