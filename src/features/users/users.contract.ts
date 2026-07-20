import type { PaginatedResponse } from '@/types/common'
import type {
  Assignment,
  AssignmentPayload,
  User,
  UpdateMePayload,
  UserListParams,
  UserPayload,
} from './users.types'

/** Shared interface implemented by the real and mock user services. */
export interface UsersService {
  list(params?: UserListParams): Promise<PaginatedResponse<User>>
  getById(id: string): Promise<User>
  create(payload: UserPayload): Promise<User>
  update(id: string, payload: Partial<UserPayload>): Promise<User>
  remove(id: string): Promise<void>
  bulkCreate(payloads: UserPayload[]): Promise<User[]>

  /** Self-service: update your own profile. */
  updateMe(payload: UpdateMePayload): Promise<User>
  /** Self-service: upload your own profile picture. */
  uploadAvatar(file: File): Promise<User>
  /** Self-service: the facilitator assigned to you, if any. */
  myFacilitator(): Promise<User | null>

  /** Students assigned to a facilitator (spec §3 `/facilitators/:id/students`). */
  facilitatorStudents(facilitatorId: string): Promise<User[]>

  listAssignments(cohortId?: string): Promise<Assignment[]>
  createAssignment(payload: AssignmentPayload): Promise<Assignment>
  deleteAssignment(id: string): Promise<void>
}
