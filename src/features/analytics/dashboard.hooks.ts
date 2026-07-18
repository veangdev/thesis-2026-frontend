'use client'

import { useQuery } from '@tanstack/react-query'
import { env } from '@/config/env'
import { API_ENDPOINTS } from '@/constants/api'
import { cohortsService } from '@/features/cohorts'
import { mockAnalyticsService } from '@/mocks/services/analytics.mock'
import { apiClient } from '@/services/api-client'
import {
  adaptCohortAnalytics,
  adaptOverview,
  type RawCohortAnalytics,
  type RawOverview,
} from './analytics.adapter'

/**
 * Dashboard hooks for the coordinator home. Against the real backend they hit
 * the API and aggregate the cross-cohort completion / at-risk counts and cohort
 * name that the generic analytics service omits. When `NEXT_PUBLIC_USE_MOCKS`
 * is on (e.g. the e2e suite) they defer to the mock analytics service, which
 * already returns those fields — so the dashboard works with no backend, like
 * the rest of the app. Distinct query keys avoid colliding with the mock hooks.
 */
const KEY = ['analytics', 'real'] as const

export function useRealCohorts() {
  return useQuery({
    queryKey: [...KEY, 'cohorts'],
    queryFn: () => cohortsService.list({ pageSize: 100 }),
  })
}

export function useRealOverviewAnalytics() {
  return useQuery({
    queryKey: [...KEY, 'overview'],
    queryFn: async () => {
      if (env.useMocks) return mockAnalyticsService.overview()
      const raw = await apiClient.get<RawOverview>(
        API_ENDPOINTS.analytics.overview
      )
      // Program-wide completion and at-risk counts aren't on the overview
      // endpoint, so derive them by aggregating each cohort's analytics.
      const cohorts = await cohortsService.list({ pageSize: 100 })
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
      if (env.useMocks) return mockAnalyticsService.cohort(cohortId as string)
      const raw = await apiClient.get<RawCohortAnalytics>(
        API_ENDPOINTS.analytics.cohort(cohortId as string)
      )
      return adaptCohortAnalytics(raw, cohortName)
    },
    enabled: !!cohortId,
  })
}
