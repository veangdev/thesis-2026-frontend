import type { StudentClass } from '@/constants/classes'
import type { Gender } from '@/constants/genders'
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
  gender?: Gender
  studentClass?: StudentClass
  /** Sort the returned rows. Defaults to server/mock's natural order. */
  sortBy?: 'name' | 'gender' | 'class'
}

export interface UserPayload {
  name: string
  email: string
  role: Role
  cohortId?: string
  facilitatorId?: string
  avatar?: string
  gender?: Gender
  studentClass?: StudentClass
}

/** Mentor ↔ student assignment (spec §3 `/assignments`). */
export interface Assignment {
  id: string
  facilitatorId: string
  studentId: string
  cohortId: string
  createdAt: string
}

export interface AssignmentPayload {
  facilitatorId: string
  studentId: string
}
