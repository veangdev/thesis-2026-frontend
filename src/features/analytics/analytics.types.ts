import type { GapSeverity } from '@/lib/scoring'

/** Analytics view models (computed by the backend; mocks compute from the db). */

export type Trend = 'improving' | 'stagnant' | 'regressing'

/** Per-dimension scores for one completed/current cycle. */
export interface CycleDimensionScore {
  dimensionId: string
  dimensionName: string
  self: number | null
  mentor: number | null
  agreed: number | null
}

export interface StudentCycle {
  periodId: string
  periodName: string
  /** Average of agreed (fallback self) scores for the cycle. */
  average: number | null
  scores: CycleDimensionScore[]
}

export interface StudentAnalytics {
  studentId: string
  studentName: string
  cohortId: string
  scoringScaleMax: number
  trend: Trend
  cycles: StudentCycle[]
}

export interface CohortHeatmapRow {
  studentId: string
  studentName: string
  trend: Trend
  /** Latest agreed (fallback self) score per dimension id; null = not assessed. */
  scores: Record<string, number | null>
  average: number | null
}

export interface DimensionAverage {
  dimensionId: string
  dimensionName: string
  average: number | null
}

export interface CohortAnalytics {
  cohortId: string
  cohortName: string
  scoringScaleMax: number
  participationRate: number
  heatmap: CohortHeatmapRow[]
  dimensionAverages: DimensionAverage[]
  weakestDimensions: DimensionAverage[]
  /** Average score per period across the cohort. */
  trendline: { periodId: string; periodName: string; average: number | null }[]
}

export interface OverviewKpis {
  totalStudents: number
  totalFacilitators: number
  activeCohorts: number
  completionRate: number
  atRiskCount: number
}

export interface MentorWorkload {
  facilitatorId: string
  facilitatorName: string
  studentCount: number
  pendingReviews: number
}

export interface ActivityFeedItem {
  id: string
  message: string
  timestamp: string
  category: 'assessment' | 'coaching' | 'goal' | 'user'
}

export interface OverviewAnalytics {
  kpis: OverviewKpis
  mentorWorkload: MentorWorkload[]
  activityFeed: ActivityFeedItem[]
  /** Assessment submissions per week, most recent last. */
  activityTrend: { label: string; count: number }[]
}

export interface GapItem {
  dimensionId: string
  dimensionName: string
  self: number
  mentor: number
  /** mentor − self. */
  gap: number
  severity: GapSeverity
  note?: string
}

export interface GapAnalysis {
  assessmentId: string
  studentId: string
  studentName: string
  periodName: string
  scoringScaleMax: number
  items: GapItem[]
}
