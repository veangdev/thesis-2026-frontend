import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { UsersService } from './users.contract'
import type {
  Assignment,
  AssignmentPayload,
  User,
  UserListParams,
  UserPayload,
} from './users.types'

/** Real implementation backed by the REST API. */
export const realUsersService: UsersService = {
  list(params?: UserListParams): Promise<PaginatedResponse<User>> {
    return apiClient.get(API_ENDPOINTS.users.root, { params: { ...params } })
  },
  getById(id: string): Promise<User> {
    return apiClient.get(API_ENDPOINTS.users.byId(id))
  },
  create(payload: UserPayload): Promise<User> {
    return apiClient.post(API_ENDPOINTS.users.root, payload)
  },
  update(id: string, payload: Partial<UserPayload>): Promise<User> {
    return apiClient.patch(API_ENDPOINTS.users.byId(id), payload)
  },
  remove(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.users.byId(id))
  },
  bulkCreate(payloads: UserPayload[]): Promise<User[]> {
    return apiClient.post(API_ENDPOINTS.users.bulk, { users: payloads })
  },

  facilitatorStudents(facilitatorId: string): Promise<User[]> {
    return apiClient.get(API_ENDPOINTS.facilitators.students(facilitatorId))
  },

  listAssignments(cohortId?: string): Promise<Assignment[]> {
    return apiClient.get(API_ENDPOINTS.assignments.root, {
      params: { cohortId },
    })
  },
  createAssignment(payload: AssignmentPayload): Promise<Assignment> {
    return apiClient.post(API_ENDPOINTS.assignments.root, payload)
  },
  deleteAssignment(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.assignments.root}/${id}`)
  },
}
