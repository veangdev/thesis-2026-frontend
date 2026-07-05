import { ApiError } from '@/services/api-client'
import type { GoalsService } from '@/features/goals/goals.contract'
import type { Goal } from '@/features/goals/goals.types'
import { getDb } from '../db'
import { clone, delay, paginate } from '../latency'
import { currentMockUser } from '../session'

export const mockGoalsService: GoalsService = {
  async list(params) {
    await delay()
    let rows = getDb().goals
    if (params?.studentId)
      rows = rows.filter((goal) => goal.studentId === params.studentId)
    if (params?.status)
      rows = rows.filter((goal) => goal.status === params.status)
    rows = [...rows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return clone(paginate(rows, { page: 1, pageSize: 20, ...params }))
  },

  async getById(id) {
    await delay(150)
    const goal = getDb().goals.find((candidate) => candidate.id === id)
    if (!goal) throw new ApiError('Goal not found', 404)
    return clone(goal)
  },

  async create(payload) {
    await delay()
    const db = getDb()
    const actor = currentMockUser()
    const dimension = payload.dimensionId
      ? db.dimensions.find((candidate) => candidate.id === payload.dimensionId)
      : undefined
    const now = new Date().toISOString()
    const goal: Goal = {
      id: db.nextId(),
      studentId: payload.studentId ?? actor?.id ?? 'user-student-1',
      dimensionId: dimension?.id,
      dimensionName: dimension?.name,
      title: payload.title,
      description: payload.description,
      targetScore: payload.targetScore,
      progress: payload.progress ?? 0,
      status: payload.status ?? 'active',
      dueDate: payload.dueDate,
      createdAt: now,
      updatedAt: now,
    }
    db.goals.push(goal)
    return clone(goal)
  },

  async update(id, payload) {
    await delay()
    const db = getDb()
    const goal = db.goals.find((candidate) => candidate.id === id)
    if (!goal) throw new ApiError('Goal not found', 404)
    if (payload.dimensionId !== undefined) {
      const dimension = db.dimensions.find(
        (candidate) => candidate.id === payload.dimensionId
      )
      goal.dimensionId = dimension?.id
      goal.dimensionName = dimension?.name
    }
    const rest = { ...payload }
    delete rest.dimensionId // Already applied (with its display name) above.
    Object.assign(goal, rest)
    goal.updatedAt = new Date().toISOString()
    return clone(goal)
  },

  async remove(id) {
    await delay()
    const db = getDb()
    const index = db.goals.findIndex((candidate) => candidate.id === id)
    if (index === -1) throw new ApiError('Goal not found', 404)
    db.goals.splice(index, 1)
  },
}
