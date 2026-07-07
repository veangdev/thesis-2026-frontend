import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { GoalsService } from './goals.contract'
import type { Goal, GoalListParams, GoalPayload } from './goals.types'

/**
 * Real implementation backed by the REST API. The backend model names differ
 * from the frontend view-model (`progressPercent`/`targetDimensionId`) and has
 * no `status` column — status is derived from progress. This adapter reconciles
 * both the responses and the request payloads.
 */

interface RawGoal {
  id: string
  studentId: string
  title: string
  description?: string | null
  targetDimensionId?: string | null
  targetDimension?: { id: string; name: string } | null
  dueDate?: string | null
  progressPercent: number
  createdAt: string
  updatedAt: string
}

function toGoal(raw: RawGoal): Goal {
  const progress = raw.progressPercent ?? 0
  return {
    id: raw.id,
    studentId: raw.studentId,
    title: raw.title,
    description: raw.description ?? undefined,
    dimensionId: raw.targetDimensionId ?? undefined,
    dimensionName: raw.targetDimension?.name ?? undefined,
    progress,
    // Backend has no status column; the UI treats a fully-progressed goal as achieved.
    status: progress >= 100 ? 'achieved' : 'active',
    dueDate: raw.dueDate ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

/** Frontend GoalPayload → backend create/update DTO (drops derived fields). */
function toDto(payload: Partial<GoalPayload>) {
  return {
    title: payload.title,
    description: payload.description,
    targetDimensionId: payload.dimensionId,
    dueDate: payload.dueDate,
    progressPercent: payload.progress,
    // `status` and `targetScore` are frontend-only — the backend rejects them.
  }
}

export const realGoalsService: GoalsService = {
  async list(params?: GoalListParams): Promise<PaginatedResponse<Goal>> {
    // Backend accepts only studentId + pagination; status filter stays client-side.
    const res = await apiClient.get<PaginatedResponse<RawGoal>>(
      API_ENDPOINTS.goals.root,
      {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
          studentId: params?.studentId,
        },
      }
    )
    return { data: res.data.map(toGoal), meta: res.meta }
  },
  async getById(id: string): Promise<Goal> {
    return toGoal(await apiClient.get<RawGoal>(API_ENDPOINTS.goals.byId(id)))
  },
  async create(payload: GoalPayload): Promise<Goal> {
    const body = { ...toDto(payload), studentId: payload.studentId }
    return toGoal(await apiClient.post<RawGoal>(API_ENDPOINTS.goals.root, body))
  },
  async update(id: string, payload: Partial<GoalPayload>): Promise<Goal> {
    return toGoal(
      await apiClient.patch<RawGoal>(
        API_ENDPOINTS.goals.byId(id),
        toDto(payload)
      )
    )
  },
  remove(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.goals.byId(id))
  },
}
