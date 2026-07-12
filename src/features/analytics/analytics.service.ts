import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
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
  },
}
