/** Cohort domain models (cohorts own dimensions, periods, and the scoring scale). */

export type CohortStatus = 'active' | 'completed' | 'archived'

export interface Cohort {
  id: string
  name: string
  /** Configurable scoring scale — 5 (default) or 10. NEVER hard-code. */
  scoringScaleMax: number
  status: CohortStatus
  startDate: string
  endDate?: string
  studentCount: number
  description?: string
  createdAt: string
}

export interface Dimension {
  id: string
  cohortId: string
  name: string
  description: string
  order: number
}

export type PeriodStatus = 'upcoming' | 'active' | 'completed'

export interface Period {
  id: string
  cohortId: string
  name: string
  startDate: string
  endDate: string
  status: PeriodStatus
}

export interface CohortListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: CohortStatus
}

export interface CohortUpdatePayload {
  name?: string
  scoringScaleMax?: number
  status?: CohortStatus
  startDate?: string
  endDate?: string
  description?: string
}

export interface DimensionPayload {
  name: string
  description: string
  order?: number
}

export interface PeriodPayload {
  name: string
  startDate: string
  endDate: string
  status?: PeriodStatus
}
