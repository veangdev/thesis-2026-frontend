import type { PaginatedResponse } from '@/types/common'
import type {
  Cohort,
  CohortListParams,
  CohortUpdatePayload,
  Dimension,
  DimensionPayload,
  Period,
  PeriodPayload,
} from './cohorts.types'

/** Shared interface implemented by the real and mock cohort services. */
export interface CohortsService {
  list(params?: CohortListParams): Promise<PaginatedResponse<Cohort>>
  getById(id: string): Promise<Cohort>
  create(payload: CohortUpdatePayload & { name: string }): Promise<Cohort>
  update(id: string, payload: CohortUpdatePayload): Promise<Cohort>

  listDimensions(cohortId: string): Promise<Dimension[]>
  createDimension(
    cohortId: string,
    payload: DimensionPayload
  ): Promise<Dimension>
  updateDimension(
    id: string,
    payload: Partial<DimensionPayload>
  ): Promise<Dimension>
  deleteDimension(id: string): Promise<void>

  listPeriods(cohortId: string): Promise<Period[]>
  createPeriod(cohortId: string, payload: PeriodPayload): Promise<Period>
  updatePeriod(id: string, payload: Partial<PeriodPayload>): Promise<Period>
  deletePeriod(id: string): Promise<void>
}
