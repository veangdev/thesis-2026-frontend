'use client'

import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/constants/api'
import { realCohortsService } from '@/features/cohorts/cohorts.service'
import { apiClient } from '@/services/api-client'
import {
  adaptCohortAnalytics,
  adaptOverview,
  type RawCohortAnalytics,
  type RawOverview,
} from './analytics.adapter'

/**
 * Real-API dashboard hooks. Unlike the feature's default hooks (which follow
 * the global mock/real toggle), these ALWAYS hit the backend and adapt the
 * response — so the dashboard is driven by real data while the rest of the app
 * remains on mocks. Distinct query keys avoid colliding with the mock hooks.
 */
const KEY = ['analytics', 'real'] as const

export function useRealCohorts() {
  return useQuery({
    queryKey: [...KEY, 'cohorts'],
    queryFn: () => realCohortsService.list({ pageSize: 100 }),
  })
}

export function useRealOverviewAnalytics() {
  return useQuery({
    queryKey: [...KEY, 'overview'],
    queryFn: async () => {
      const raw = await apiClient.get<RawOverview>(
        API_ENDPOINTS.analytics.overview
      )
      // Program-wide completion and at-risk counts aren't on the overview
      // endpoint, so derive them by aggregating each cohort's analytics.
      const cohorts = await realCohortsService.list({ pageSize: 100 })
      const perCohort = await Promise.all(
        cohorts.data.map((c) =>
          apiClient.get<RawCohortAnalytics>(
            API_ENDPOINTS.analytics.cohort(c.id)
          )
        )
      )
      let total = 0
      let completed = 0
      let atRiskCount = 0
      for (const ca of perCohort) {
        for (const cr of ca.completionRates) {
          total += cr.total
          completed += cr.completed
        }
        atRiskCount += ca.atRiskStudents.length
      }
      const completionRate = total ? Math.round((completed / total) * 100) : 0
      return adaptOverview(raw, { completionRate, atRiskCount })
    },
  })
}

export function useRealCohortAnalytics(
  cohortId: string | undefined,
  cohortName: string
) {
  return useQuery({
    queryKey: [...KEY, 'cohort', cohortId ?? ''],
    queryFn: async () => {
      const raw = await apiClient.get<RawCohortAnalytics>(
        API_ENDPOINTS.analytics.cohort(cohortId as string)
      )
      return adaptCohortAnalytics(raw, cohortName)
    },
    enabled: !!cohortId,
  })
}
