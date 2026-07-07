import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { CoachingService } from './coaching.contract'
import type {
  ActionItem,
  ActionItemPayload,
  CoachingListParams,
  CoachingSession,
  CoachingSessionPayload,
} from './coaching.types'

/**
 * Real implementation backed by the REST API. The backend nests
 * participants/dimensions/facilitator as relations and names action-item text
 * `description`; this adapter flattens those onto the frontend view-model and
 * translates the query params / payloads the backend accepts.
 */

interface RawActionItem {
  id: string
  sessionId: string
  description: string
  dueDate?: string | null
  done: boolean
  createdAt: string
}

interface RawSession {
  id: string
  title: string
  scope: CoachingSession['scope']
  status: CoachingSession['status']
  facilitatorId: string
  facilitator?: { name: string } | null
  scheduledAt: string
  durationMinutes: number
  notes?: string | null
  createdAt: string
  participants: { userId: string; user: { name: string } }[]
  targetDimensions: { dimensionId: string }[]
  actionItems: RawActionItem[]
}

function toActionItem(raw: RawActionItem): ActionItem {
  return {
    id: raw.id,
    sessionId: raw.sessionId,
    title: raw.description,
    done: raw.done,
    dueDate: raw.dueDate ?? undefined,
    createdAt: raw.createdAt,
  }
}

function toSession(raw: RawSession): CoachingSession {
  return {
    id: raw.id,
    title: raw.title,
    scope: raw.scope,
    status: raw.status,
    facilitatorId: raw.facilitatorId,
    facilitatorName: raw.facilitator?.name ?? '',
    participantIds: raw.participants.map((p) => p.userId),
    participantNames: raw.participants.map((p) => p.user.name),
    dimensionIds: raw.targetDimensions.map((d) => d.dimensionId),
    cohortId: undefined,
    notes: raw.notes ?? undefined,
    scheduledAt: raw.scheduledAt,
    durationMinutes: raw.durationMinutes,
    followUpAt: undefined, // backend has no follow-up column
    actionItems: raw.actionItems.map(toActionItem),
    createdAt: raw.createdAt,
  }
}

/** Convert a `YYYY-MM` month into the [from, to] ISO range the backend accepts. */
function monthRange(month?: string): { from?: string; to?: string } {
  if (!month) return {}
  const [y, m] = month.split('-').map(Number)
  if (!y || !m) return {}
  const from = new Date(Date.UTC(y, m - 1, 1)).toISOString()
  const to = new Date(Date.UTC(y, m, 1)).toISOString()
  return { from, to }
}

export const realCoachingService: CoachingService = {
  async list(
    params?: CoachingListParams
  ): Promise<PaginatedResponse<CoachingSession>> {
    const { from, to } = monthRange(params?.month)
    const res = await apiClient.get<PaginatedResponse<RawSession>>(
      API_ENDPOINTS.coachingSessions.root,
      {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
          facilitatorId: params?.facilitatorId,
          studentId: params?.studentId,
          from,
          to,
        },
      }
    )
    // Backend can't filter by status/scope/cohortId — apply client-side.
    let data = res.data.map(toSession)
    if (params?.status) data = data.filter((s) => s.status === params.status)
    if (params?.scope) data = data.filter((s) => s.scope === params.scope)
    return { data, meta: res.meta }
  },

  async getById(id: string): Promise<CoachingSession> {
    return toSession(
      await apiClient.get<RawSession>(API_ENDPOINTS.coachingSessions.byId(id))
    )
  },

  async create(payload: CoachingSessionPayload): Promise<CoachingSession> {
    const body = {
      title: payload.title,
      scope: payload.scope,
      participantIds: payload.participantIds,
      cohortId: payload.cohortId,
      targetDimensionIds: payload.dimensionIds,
      notes: payload.notes,
      scheduledAt: payload.scheduledAt,
      durationMinutes: payload.durationMinutes,
    }
    return toSession(
      await apiClient.post<RawSession>(
        API_ENDPOINTS.coachingSessions.root,
        body
      )
    )
  },

  async update(
    id: string,
    payload: Partial<CoachingSessionPayload>
  ): Promise<CoachingSession> {
    // Backend update DTO only accepts these fields.
    const body = {
      title: payload.title,
      scheduledAt: payload.scheduledAt,
      durationMinutes: payload.durationMinutes,
      notes: payload.notes,
      status: payload.status,
    }
    return toSession(
      await apiClient.patch<RawSession>(
        API_ENDPOINTS.coachingSessions.byId(id),
        body
      )
    )
  },

  remove(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.coachingSessions.byId(id))
  },

  async createActionItem(
    sessionId: string,
    payload: ActionItemPayload
  ): Promise<ActionItem> {
    const raw = await apiClient.post<RawActionItem>(
      API_ENDPOINTS.coachingSessions.actionItems(sessionId),
      { description: payload.title, dueDate: payload.dueDate }
    )
    return toActionItem(raw)
  },

  async updateActionItem(
    id: string,
    payload: Partial<ActionItemPayload>
  ): Promise<ActionItem> {
    const raw = await apiClient.patch<RawActionItem>(
      API_ENDPOINTS.actionItems.byId(id),
      {
        description: payload.title,
        dueDate: payload.dueDate,
        done: payload.done,
      }
    )
    return toActionItem(raw)
  },

  deleteActionItem(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.actionItems.byId(id))
  },
}
