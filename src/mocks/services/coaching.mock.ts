import { ApiError } from '@/services/api-client'
import type { CoachingService } from '@/features/coaching/coaching.contract'
import type {
  ActionItem,
  CoachingSession,
} from '@/features/coaching/coaching.types'
import { getDb } from '../db'
import { clone, delay, paginate } from '../latency'
import { currentMockUser } from '../session'

function findSession(id: string): CoachingSession {
  const session = getDb().coachingSessions.find(
    (candidate) => candidate.id === id
  )
  if (!session) throw new ApiError('Coaching session not found', 404)
  return session
}

export const mockCoachingService: CoachingService = {
  async list(params) {
    await delay()
    let rows = getDb().coachingSessions
    if (params?.facilitatorId)
      rows = rows.filter((s) => s.facilitatorId === params.facilitatorId)
    if (params?.studentId)
      rows = rows.filter((s) =>
        s.participantIds.includes(params.studentId as string)
      )
    if (params?.cohortId)
      rows = rows.filter((s) => s.cohortId === params.cohortId)
    if (params?.status) rows = rows.filter((s) => s.status === params.status)
    if (params?.scope) rows = rows.filter((s) => s.scope === params.scope)
    if (params?.month)
      rows = rows.filter((s) =>
        s.scheduledAt.startsWith(params.month as string)
      )
    rows = [...rows].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    return clone(paginate(rows, { page: 1, pageSize: 50, ...params }))
  },

  async getById(id) {
    await delay(150)
    return clone(findSession(id))
  },

  async create(payload) {
    await delay()
    const db = getDb()
    const actor = currentMockUser()
    const participants = payload.participantIds
      .map((participantId) =>
        db.users.find((user) => user.id === participantId)
      )
      .filter(Boolean)
    const session: CoachingSession = {
      id: db.nextId(),
      title: payload.title,
      scope: payload.scope,
      status: payload.status ?? 'scheduled',
      facilitatorId: actor?.id ?? 'user-facilitator-1',
      facilitatorName: actor?.name ?? 'Facilitator',
      participantIds: payload.participantIds,
      participantNames: participants.map((user) => user!.name),
      cohortId: payload.cohortId ?? participants[0]?.cohortId,
      dimensionIds: payload.dimensionIds ?? [],
      notes: payload.notes,
      scheduledAt: payload.scheduledAt,
      durationMinutes: payload.durationMinutes ?? 45,
      followUpAt: payload.followUpAt,
      actionItems: [],
      createdAt: new Date().toISOString(),
    }
    db.coachingSessions.push(session)
    return clone(session)
  },

  async update(id, payload) {
    await delay()
    const session = findSession(id)
    const { participantIds, ...rest } = payload
    Object.assign(session, rest)
    if (participantIds) {
      const db = getDb()
      session.participantIds = participantIds
      session.participantNames = participantIds.map(
        (pid) => db.users.find((user) => user.id === pid)?.name ?? 'Unknown'
      )
    }
    return clone(session)
  },

  async remove(id) {
    await delay()
    const db = getDb()
    const index = db.coachingSessions.findIndex(
      (candidate) => candidate.id === id
    )
    if (index === -1) throw new ApiError('Coaching session not found', 404)
    db.coachingSessions.splice(index, 1)
  },

  async createActionItem(sessionId, payload) {
    await delay()
    const session = findSession(sessionId)
    const item: ActionItem = {
      id: getDb().nextId(),
      sessionId,
      title: payload.title,
      done: payload.done ?? false,
      assigneeId: payload.assigneeId,
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString(),
    }
    session.actionItems.push(item)
    return clone(item)
  },

  async updateActionItem(id, payload) {
    await delay(150)
    for (const session of getDb().coachingSessions) {
      const item = session.actionItems.find((candidate) => candidate.id === id)
      if (item) {
        Object.assign(item, payload)
        return clone(item)
      }
    }
    throw new ApiError('Action item not found', 404)
  },

  async deleteActionItem(id) {
    await delay(150)
    for (const session of getDb().coachingSessions) {
      const index = session.actionItems.findIndex(
        (candidate) => candidate.id === id
      )
      if (index !== -1) {
        session.actionItems.splice(index, 1)
        return
      }
    }
    throw new ApiError('Action item not found', 404)
  },
}
