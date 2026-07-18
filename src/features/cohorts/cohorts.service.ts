import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { CohortsService } from './cohorts.contract'
import type {
  Cohort,
  CohortListParams,
  CohortStatus,
  CohortUpdatePayload,
  Dimension,
  DimensionPayload,
  Period,
  PeriodPayload,
  PeriodStatus,
} from './cohorts.types'

/**
 * Real implementation backed by the REST API. The backend cohort shape uses
 * `expectedEndDate` (not `endDate`) and has no status/studentCount/description;
 * period status uses a different enum (`open`/`closed`). This adapter reconciles
 * responses, request payloads, query params, and the period-status enum.
 */

interface RawCohort {
  id: string
  name: string
  scoringScaleMax: number
  startDate: string
  expectedEndDate?: string | null
  createdAt: string
}

function toCohort(raw: RawCohort): Cohort {
  const ended = raw.expectedEndDate
    ? new Date(raw.expectedEndDate).getTime() < Date.now()
    : false
  return {
    id: raw.id,
    name: raw.name,
    scoringScaleMax: raw.scoringScaleMax,
    status: ended ? 'completed' : 'active',
    startDate: raw.startDate,
    endDate: raw.expectedEndDate ?? undefined,
    studentCount: 0, // backend does not aggregate membership counts
    description: undefined,
    createdAt: raw.createdAt,
  }
}

interface RawDimension {
  id: string
  cohortId: string
  name: string
  description: string | null
  order: number
  isActive?: boolean
}

function toDimension(raw: RawDimension): Dimension {
  return {
    id: raw.id,
    cohortId: raw.cohortId,
    name: raw.name,
    description: raw.description ?? '',
    order: raw.order,
  }
}

// Period status enum: backend upcoming|open|closed ↔ frontend upcoming|active|completed.
const PERIOD_STATUS_FROM: Record<string, PeriodStatus> = {
  upcoming: 'upcoming',
  open: 'active',
  closed: 'completed',
}
const PERIOD_STATUS_TO: Record<PeriodStatus, string> = {
  upcoming: 'upcoming',
  active: 'open',
  completed: 'closed',
}

interface RawPeriod {
  id: string
  cohortId: string
  name: string
  startDate: string
  endDate: string
  status: string
}

function toPeriod(raw: RawPeriod): Period {
  return {
    id: raw.id,
    cohortId: raw.cohortId,
    name: raw.name,
    startDate: raw.startDate,
    endDate: raw.endDate,
    status: PERIOD_STATUS_FROM[raw.status] ?? 'upcoming',
  }
}

export const realCohortsService: CohortsService = {
  async list(params?: CohortListParams): Promise<PaginatedResponse<Cohort>> {
    // Backend accepts only pagination; search/status are filtered client-side.
    const res = await apiClient.get<PaginatedResponse<RawCohort>>(
      API_ENDPOINTS.cohorts.root,
      { params: { page: params?.page, pageSize: params?.pageSize ?? 100 } }
    )
    let data = res.data.map(toCohort)
    if (params?.search) {
      const q = params.search.toLowerCase()
      data = data.filter((c) => c.name.toLowerCase().includes(q))
    }
    if (params?.status) {
      const status = params.status as CohortStatus
      data = data.filter((c) => c.status === status)
    }
    return { data, meta: res.meta }
  },
  async getById(id: string): Promise<Cohort> {
    return toCohort(
      await apiClient.get<RawCohort>(API_ENDPOINTS.cohorts.byId(id))
    )
  },
  async create(
    payload: CohortUpdatePayload & { name: string }
  ): Promise<Cohort> {
    const body = {
      name: payload.name,
      startDate: payload.startDate,
      expectedEndDate: payload.endDate,
      scoringScaleMax: payload.scoringScaleMax,
    }
    return toCohort(
      await apiClient.post<RawCohort>(API_ENDPOINTS.cohorts.root, body)
    )
  },
  async update(id: string, payload: CohortUpdatePayload): Promise<Cohort> {
    const body = {
      name: payload.name,
      scoringScaleMax: payload.scoringScaleMax,
      startDate: payload.startDate,
      expectedEndDate: payload.endDate,
    }
    return toCohort(
      await apiClient.patch<RawCohort>(API_ENDPOINTS.cohorts.byId(id), body)
    )
  },

  async listDimensions(cohortId: string): Promise<Dimension[]> {
    const raw = await apiClient.get<RawDimension[]>(
      API_ENDPOINTS.cohorts.dimensions(cohortId)
    )
    // Deleted dimensions are soft-deactivated; hide them.
    return raw.filter((d) => d.isActive !== false).map(toDimension)
  },
  async createDimension(
    cohortId: string,
    payload: DimensionPayload
  ): Promise<Dimension> {
    return toDimension(
      await apiClient.post<RawDimension>(
        API_ENDPOINTS.cohorts.dimensions(cohortId),
        payload
      )
    )
  },
  async updateDimension(
    id: string,
    payload: Partial<DimensionPayload>
  ): Promise<Dimension> {
    return toDimension(
      await apiClient.patch<RawDimension>(
        API_ENDPOINTS.dimensions.byId(id),
        payload
      )
    )
  },
  deleteDimension(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.dimensions.byId(id))
  },

  async listPeriods(cohortId: string): Promise<Period[]> {
    const raw = await apiClient.get<RawPeriod[]>(
      API_ENDPOINTS.cohorts.periods(cohortId)
    )
    return raw.map(toPeriod)
  },
  async createPeriod(
    cohortId: string,
    payload: PeriodPayload
  ): Promise<Period> {
    // Backend create rejects `status`; new periods default to upcoming.
    const body = {
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
    }
    return toPeriod(
      await apiClient.post<RawPeriod>(
        API_ENDPOINTS.cohorts.periods(cohortId),
        body
      )
    )
  },
  async updatePeriod(
    id: string,
    payload: Partial<PeriodPayload>
  ): Promise<Period> {
    const body = {
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: payload.status ? PERIOD_STATUS_TO[payload.status] : undefined,
    }
    return toPeriod(
      await apiClient.patch<RawPeriod>(API_ENDPOINTS.periods.byId(id), body)
    )
  },
  deletePeriod(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.periods.byId(id))
  },
}
