import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { CohortsService } from './cohorts.contract'
import type {
  Cohort,
  CohortListParams,
  CohortUpdatePayload,
  Dimension,
  DimensionPayload,
  Period,
  PeriodPayload,
} from './cohorts.types'

/** Real implementation backed by the REST API. */
export const realCohortsService: CohortsService = {
  list(params?: CohortListParams): Promise<PaginatedResponse<Cohort>> {
    return apiClient.get(API_ENDPOINTS.cohorts.root, { params: { ...params } })
  },
  getById(id: string): Promise<Cohort> {
    return apiClient.get(API_ENDPOINTS.cohorts.byId(id))
  },
  create(payload): Promise<Cohort> {
    return apiClient.post(API_ENDPOINTS.cohorts.root, payload)
  },
  update(id: string, payload: CohortUpdatePayload): Promise<Cohort> {
    return apiClient.patch(API_ENDPOINTS.cohorts.byId(id), payload)
  },

  listDimensions(cohortId: string): Promise<Dimension[]> {
    return apiClient.get(API_ENDPOINTS.cohorts.dimensions(cohortId))
  },
  createDimension(
    cohortId: string,
    payload: DimensionPayload
  ): Promise<Dimension> {
    return apiClient.post(API_ENDPOINTS.cohorts.dimensions(cohortId), payload)
  },
  updateDimension(
    id: string,
    payload: Partial<DimensionPayload>
  ): Promise<Dimension> {
    return apiClient.patch(API_ENDPOINTS.dimensions.byId(id), payload)
  },
  deleteDimension(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.dimensions.byId(id))
  },

  listPeriods(cohortId: string): Promise<Period[]> {
    return apiClient.get(API_ENDPOINTS.cohorts.periods(cohortId))
  },
  createPeriod(cohortId: string, payload: PeriodPayload): Promise<Period> {
    return apiClient.post(API_ENDPOINTS.cohorts.periods(cohortId), payload)
  },
  updatePeriod(id: string, payload: Partial<PeriodPayload>): Promise<Period> {
    return apiClient.patch(API_ENDPOINTS.periods.byId(id), payload)
  },
  deletePeriod(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.periods.byId(id))
  },
}
