import type { Role } from '@/constants/roles'
import type { User } from '@/types/auth'

export type { User }

export interface UserListParams {
  page?: number
  pageSize?: number
  search?: string
  role?: Role
  cohortId?: string
  facilitatorId?: string
}

export interface UserPayload {
  name: string
  email: string
  role: Role
  cohortId?: string
  facilitatorId?: string
  avatar?: string
}

/** Mentor ↔ student assignment (spec §3 `/assignments`). */
export interface Assignment {
  id: string
  facilitatorId: string
  studentId: string
  cohortId: string
  createdAt: string
}

/** The narrow set of fields a user may change on their own profile. */
export interface UpdateMePayload {
  name?: string
  expertiseTags?: string[]
  /** Calendar days, as YYYY-MM-DD. */
  availability?: string[]
}

export interface AssignmentPayload {
  facilitatorId: string
  studentId: string
}
