import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
<<<<<<< HEAD
import type { AnalyticsService } from './analytics.contract'

/** Real implementation backed by the REST API. */
export const realAnalyticsService: AnalyticsService = {
  student(studentId) {
    return apiClient.get(API_ENDPOINTS.analytics.student(studentId))
  },
  cohort(cohortId) {
    return apiClient.get(API_ENDPOINTS.analytics.cohort(cohortId))
  },
  overview() {
    return apiClient.get(API_ENDPOINTS.analytics.overview)
  },
  gap(assessmentId) {
    return apiClient.get(API_ENDPOINTS.analytics.gap(assessmentId))
=======
import {
  adaptCohortAnalytics,
  adaptGapAnalysis,
  adaptOverview,
  adaptStudentAnalytics,
  type RawCohortAnalytics,
  type RawGapAnalysis,
  type RawOverview,
  type RawStudentAnalytics,
} from './analytics.adapter'
import type { AnalyticsService } from './analytics.contract'

/**
 * Real implementation backed by the REST API. All four endpoints are shaped
 * differently from the frontend view-models, so each response is run through
 * the adapters in `analytics.adapter.ts`.
 *
 * Note: `overview`/`cohort` here omit the cross-cohort aggregation and cohort
 * name that the coordinator dashboard needs — that dashboard uses the dedicated
 * hooks in `dashboard.hooks.ts`. These implementations exist so any other
 * consumer of the generic service still receives correctly-shaped data.
 */
export const realAnalyticsService: AnalyticsService = {
  async student(studentId) {
    const raw = await apiClient.get<RawStudentAnalytics>(
      API_ENDPOINTS.analytics.student(studentId)
    )
    return adaptStudentAnalytics(raw, raw.studentName ?? '')
  },
  async cohort(cohortId) {
    const raw = await apiClient.get<RawCohortAnalytics>(
      API_ENDPOINTS.analytics.cohort(cohortId)
    )
    return adaptCohortAnalytics(raw, '')
  },
  async overview() {
    const raw = await apiClient.get<RawOverview>(
      API_ENDPOINTS.analytics.overview
    )
    return adaptOverview(raw, { completionRate: 0, atRiskCount: 0 })
  },
  async gap(assessmentId) {
    const raw = await apiClient.get<RawGapAnalysis>(
      API_ENDPOINTS.analytics.gap(assessmentId)
    )
    return adaptGapAnalysis(raw)
>>>>>>> origin/main
  },
}
