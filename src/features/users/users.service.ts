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

/**
 * Real implementation backed by the REST API. The backend user shape uses
 * `avatarUrl` (not `avatar`) and does not carry `cohortId`/`facilitatorId`;
 * creates require a `password`. This adapter reconciles those.
 */

const DEFAULT_TEMP_PASSWORD = 'Password123!'

interface RawUser {
  id: string
  name: string
  email: string
  role: User['role']
  avatarUrl?: string | null
  createdAt: string
}

function toUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatar: raw.avatarUrl ?? undefined,
    createdAt: raw.createdAt,
  }
}

/** Frontend UserPayload → backend CreateUserDto. */
function toCreateDto(p: UserPayload) {
  return {
    name: p.name,
    email: p.email,
    role: p.role,
    password: DEFAULT_TEMP_PASSWORD,
  }
}

interface RawAssignment {
  id: string
  facilitatorId: string
  selfAssessorId: string
  cohortId: string
  createdAt: string
}

function toAssignment(raw: RawAssignment): Assignment {
  return {
    id: raw.id,
    facilitatorId: raw.facilitatorId,
    studentId: raw.selfAssessorId,
    cohortId: raw.cohortId,
    createdAt: raw.createdAt,
  }
}

export const realUsersService: UsersService = {
  async list(params?: UserListParams): Promise<PaginatedResponse<User>> {
    // Backend rejects facilitatorId as a query param and caps pageSize at 100.
    const res = await apiClient.get<PaginatedResponse<RawUser>>(
      API_ENDPOINTS.users.root,
      {
        params: {
          page: params?.page,
          pageSize:
            params?.pageSize != null
              ? Math.min(params.pageSize, 100)
              : undefined,
          search: params?.search,
          role: params?.role,
          cohortId: params?.cohortId,
        },
      }
    )
    return { data: res.data.map(toUser), meta: res.meta }
  },
  async getById(id: string): Promise<User> {
    return toUser(await apiClient.get<RawUser>(API_ENDPOINTS.users.byId(id)))
  },
  async create(payload: UserPayload): Promise<User> {
    return toUser(
      await apiClient.post<RawUser>(
        API_ENDPOINTS.users.root,
        toCreateDto(payload)
      )
    )
  },
  async update(id: string, payload: Partial<UserPayload>): Promise<User> {
    // Backend UpdateUserDto only accepts name/email/role.
    const body = {
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }
    return toUser(
      await apiClient.patch<RawUser>(API_ENDPOINTS.users.byId(id), body)
    )
  },
  remove(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.users.byId(id))
  },
  async bulkCreate(payloads: UserPayload[]): Promise<User[]> {
    const users = await apiClient.post<RawUser[]>(API_ENDPOINTS.users.bulk, {
      users: payloads.map(toCreateDto),
    })
    return users.map(toUser)
  },

  async facilitatorStudents(facilitatorId: string): Promise<User[]> {
    const students = await apiClient.get<RawUser[]>(
      API_ENDPOINTS.facilitators.students(facilitatorId)
    )
    return students.map(toUser)
  },

  async listAssignments(cohortId?: string): Promise<Assignment[]> {
    // Endpoint is paginated; unwrap `.data` and rename selfAssessorId→studentId.
    const res = await apiClient.get<PaginatedResponse<RawAssignment>>(
      API_ENDPOINTS.assignments.root,
      { params: { cohortId, pageSize: 100 } }
    )
    return res.data.map(toAssignment)
  },
  async createAssignment(payload: AssignmentPayload): Promise<Assignment> {
    const raw = await apiClient.post<RawAssignment>(
      API_ENDPOINTS.assignments.root,
      {
        facilitatorId: payload.facilitatorId,
        selfAssessorId: payload.studentId,
      }
    )
    return toAssignment(raw)
  },
  deleteAssignment(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.assignments.root}/${id}`)
  },
}
