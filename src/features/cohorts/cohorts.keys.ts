import type { CohortListParams } from './cohorts.types'

export const cohortKeys = {
  all: ['cohorts'] as const,
  lists: () => [...cohortKeys.all, 'list'] as const,
  list: (params?: CohortListParams) =>
    [...cohortKeys.lists(), params ?? {}] as const,
  detail: (id: string) => [...cohortKeys.all, 'detail', id] as const,
  dimensions: (cohortId: string) =>
    [...cohortKeys.all, cohortId, 'dimensions'] as const,
  periods: (cohortId: string) =>
    [...cohortKeys.all, cohortId, 'periods'] as const,
}
