import { ApiError } from '@/services/api-client'
import type { UsersService } from '@/features/users/users.contract'
import type {
  Assignment,
  User,
  UserListParams,
  UserPayload,
} from '@/features/users/users.types'
import { getDb } from '../db'
import { currentMockUser } from '../session'
import { clone, delay, paginate } from '../latency'

function applyFilters(users: User[], params?: UserListParams): User[] {
  let rows = users
  if (params?.role) rows = rows.filter((user) => user.role === params.role)
  if (params?.cohortId)
    rows = rows.filter((user) => user.cohortId === params.cohortId)
  if (params?.facilitatorId)
    rows = rows.filter((user) => user.facilitatorId === params.facilitatorId)
  if (params?.search) {
    const query = params.search.toLowerCase()
    rows = rows.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }
  return rows
}

export const mockUsersService: UsersService = {
  async list(params) {
    await delay()
    return clone(paginate(applyFilters(getDb().users, params), params))
  },

  async getById(id) {
    await delay(150)
    const user = getDb().users.find((candidate) => candidate.id === id)
    if (!user) throw new ApiError('User not found', 404)
    return clone(user)
  },

  async create(payload: UserPayload) {
    await delay()
    const db = getDb()
    const user: User = {
      id: db.nextId(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      cohortId: payload.cohortId,
      facilitatorId: payload.facilitatorId,
      avatar: payload.avatar,
      createdAt: new Date().toISOString(),
    }
    db.users.push(user)
    return clone(user)
  },

  async update(id, payload) {
    await delay()
    const user = getDb().users.find((candidate) => candidate.id === id)
    if (!user) throw new ApiError('User not found', 404)
    Object.assign(user, payload)
    return clone(user)
  },

  async remove(id) {
    await delay()
    const db = getDb()
    const index = db.users.findIndex((candidate) => candidate.id === id)
    if (index === -1) throw new ApiError('User not found', 404)
    db.users.splice(index, 1)
  },

  async bulkCreate(payloads) {
    await delay(400)
    const created: User[] = []
    for (const payload of payloads) {
      created.push(await this.create(payload))
    }
    return created
  },

  async updateMe(payload) {
    await delay()
    const me = currentMockUser()
    if (!me) throw new ApiError('Unauthorized', 401)
    Object.assign(me, payload)
    return clone(me)
  },

  async uploadAvatar(file) {
    await delay(300)
    const me = currentMockUser()
    if (!me) throw new ApiError('Unauthorized', 401)
    me.avatar = URL.createObjectURL(file)
    return clone(me)
  },

  async myFacilitator() {
    await delay()
    const me = currentMockUser()
    if (!me) throw new ApiError('Unauthorized', 401)
    const facilitator = getDb().users.find(
      (user) => user.id === me.facilitatorId
    )
    return facilitator ? clone(facilitator) : null
  },

  async facilitatorStudents(facilitatorId) {
    await delay()
    return clone(
      getDb().users.filter((user) => user.facilitatorId === facilitatorId)
    )
  },

  async listAssignments(cohortId) {
    await delay()
    const rows = getDb().assignments.filter(
      (assignment) => !cohortId || assignment.cohortId === cohortId
    )
    return clone(rows)
  },

  async createAssignment(payload) {
    await delay()
    const db = getDb()
    const student = db.users.find((user) => user.id === payload.studentId)
    if (!student) throw new ApiError('Student not found', 404)

    // One facilitator per student: replace any existing assignment.
    const existingIndex = db.assignments.findIndex(
      (assignment) => assignment.studentId === payload.studentId
    )
    if (existingIndex !== -1) db.assignments.splice(existingIndex, 1)

    student.facilitatorId = payload.facilitatorId
    const assignment: Assignment = {
      id: db.nextId(),
      facilitatorId: payload.facilitatorId,
      studentId: payload.studentId,
      cohortId: student.cohortId ?? '',
      createdAt: new Date().toISOString(),
    }
    db.assignments.push(assignment)
    return clone(assignment)
  },

  async deleteAssignment(id) {
    await delay()
    const db = getDb()
    const index = db.assignments.findIndex((assignment) => assignment.id === id)
    if (index === -1) throw new ApiError('Assignment not found', 404)
    const [removed] = db.assignments.splice(index, 1)
    const student = db.users.find((user) => user.id === removed.studentId)
    if (student) student.facilitatorId = undefined
  },
}
