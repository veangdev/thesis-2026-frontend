import type {
  CohortAnalytics,
  GapAnalysis,
  OverviewAnalytics,
  StudentAnalytics,
} from './analytics.types'

/** Shared interface implemented by the real and mock analytics services. */
export interface AnalyticsService {
  student(studentId: string): Promise<StudentAnalytics>
  cohort(cohortId: string): Promise<CohortAnalytics>
  overview(): Promise<OverviewAnalytics>
  gap(assessmentId: string): Promise<GapAnalysis>
}
