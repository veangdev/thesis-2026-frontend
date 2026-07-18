import type { GapSeverity } from '@/lib/scoring'
import type {
  CohortAnalytics,
  CohortHeatmapRow,
  DimensionAverage,
  GapAnalysis,
  MentorWorkload,
  OverviewAnalytics,
  StudentAnalytics,
  StudentCycle,
  Trend,
} from './analytics.types'

/**
 * Adapters that map the raw NestJS analytics responses onto the frontend
 * dashboard view-models. The backend and the mock layer were designed against
 * slightly different contracts; these functions are the single place that
 * reconciles the two so the components stay unchanged. Fields the backend does
 * not (yet) expose are defaulted here and hidden by the component.
 */

// ── Raw backend shapes (source: thesis-2026-backend analytics module) ────────

export interface RawOverview {
  kpis: {
    totalUsers: number
    usersByRole: Record<string, number>
    totalCohorts: number
    openPeriods: number
    completedAssessments: number
  }
  mentorWorkload: {
    facilitatorId: string
    name: string
    assignedStudents: number
    completedReviews: number
  }[]
}

export interface RawCohortAnalytics {
  cohortId: string
  scaleMax: number
  weakestDimensions: {
    dimensionId: string
    dimensionName: string
    average: number | null
  }[]
  completionRates: {
    periodId: string
    periodName: string
    total: number
    completed: number
    /** Fraction in [0, 1]. */
    rate: number
  }[]
  heatmap: {
    studentId: string
    studentName: string
    scores: { dimensionId: string; agreedScore: number | null }[]
  }[]
  atRiskStudents: {
    studentId: string
    studentName: string
    latestAverage: number
    coachingFlags: number
  }[]
}

// ── Adapters ─────────────────────────────────────────────────────────────────

export function adaptCohortAnalytics(
  raw: RawCohortAnalytics,
  cohortName: string
): CohortAnalytics {
  const dimensionAverages: DimensionAverage[] = raw.weakestDimensions.map(
    (d) => ({
      dimensionId: d.dimensionId,
      dimensionName: d.dimensionName,
      average: d.average,
    })
  )

  const heatmap: CohortHeatmapRow[] = raw.heatmap.map((row) => {
    const scores: Record<string, number | null> = {}
    for (const s of row.scores) scores[s.dimensionId] = s.agreedScore
    const present = row.scores
      .map((s) => s.agreedScore)
      .filter((v): v is number => v != null)
    const average = present.length
      ? present.reduce((a, b) => a + b, 0) / present.length
      : null
    return {
      studentId: row.studentId,
      studentName: row.studentName,
      // The backend does not classify a per-student trend on this endpoint.
      trend: 'stagnant',
      scores,
      average,
    }
  })

  // Use the most recent period that actually has submissions — the last entry
  // is often an upcoming cycle with 0 completion, which reads as "0%".
  const withActivity = raw.completionRates.filter((c) => c.completed > 0)
  const latest = withActivity.at(-1) ?? raw.completionRates.at(-1)
  const participationRate = latest ? Math.round(latest.rate * 100) : 0

  return {
    cohortId: raw.cohortId,
    cohortName,
    scoringScaleMax: raw.scaleMax,
    participationRate,
    heatmap,
    dimensionAverages,
    // Weakest-first; surface the three lowest as focus areas.
    weakestDimensions: [...raw.weakestDimensions]
      .sort((a, b) => (a.average ?? 0) - (b.average ?? 0))
      .slice(0, 3),
    // Backend does not expose per-period average scores yet → no trendline.
    trendline: [],
  }
}

export interface OverviewExtras {
  completionRate: number
  atRiskCount: number
}

export function adaptOverview(
  raw: RawOverview,
  extras: OverviewExtras
): OverviewAnalytics {
  const mentorWorkload: MentorWorkload[] = raw.mentorWorkload.map((m) => ({
    facilitatorId: m.facilitatorId,
    facilitatorName: m.name,
    studentCount: m.assignedStudents,
    // Backend exposes completed reviews, not a pending count.
    pendingReviews: 0,
  }))

  return {
    kpis: {
      totalStudents: raw.kpis.usersByRole['self_assessor'] ?? 0,
      totalFacilitators: raw.kpis.usersByRole['facilitator'] ?? 0,
      activeCohorts: raw.kpis.totalCohorts,
      completionRate: extras.completionRate,
      atRiskCount: extras.atRiskCount,
    },
    mentorWorkload,
    // Not provided by the backend yet; the dashboard hides these sections.
    activityFeed: [],
    activityTrend: [],
  }
}

// ── Student analytics ────────────────────────────────────────────────────────

export interface RawStudentAnalytics {
  studentId: string
  studentName?: string
  scaleMax: number
  periods: {
    periodId: string
    periodName: string
    average: number | null
    scores: {
      dimensionId: string
      dimensionName: string
      agreedScore: number | null
    }[]
  }[]
  latest: {
    periodId: string
    gaps: {
      dimensionId: string
      selfScore: number | null
      mentorScore: number | null
    }[]
  } | null
}

/** Derive an overall trend from the change between the last two graded cycles. */
function deriveTrend(periods: RawStudentAnalytics['periods']): Trend {
  const graded = periods.filter((p) => p.average != null)
  if (graded.length < 2) return 'stagnant'
  const last = graded[graded.length - 1].average as number
  const prev = graded[graded.length - 2].average as number
  if (last > prev) return 'improving'
  if (last < prev) return 'regressing'
  return 'stagnant'
}

export function adaptStudentAnalytics(
  raw: RawStudentAnalytics,
  studentName: string
): StudentAnalytics {
  const latestGaps = new Map(
    (raw.latest?.gaps ?? []).map((g) => [g.dimensionId, g])
  )
  const cycles: StudentCycle[] = raw.periods.map((p) => ({
    periodId: p.periodId,
    periodName: p.periodName,
    average: p.average,
    scores: p.scores.map((s) => {
      // Self/mentor scores are only available for the latest cycle.
      const gap =
        p.periodId === raw.latest?.periodId
          ? latestGaps.get(s.dimensionId)
          : undefined
      return {
        dimensionId: s.dimensionId,
        dimensionName: s.dimensionName,
        self: gap?.selfScore ?? null,
        mentor: gap?.mentorScore ?? null,
        agreed: s.agreedScore,
      }
    }),
  }))

  return {
    studentId: raw.studentId,
    studentName: raw.studentName ?? studentName,
    cohortId: '',
    scoringScaleMax: raw.scaleMax,
    trend: deriveTrend(raw.periods),
    cycles,
  }
}

// ── Gap analysis ─────────────────────────────────────────────────────────────

export interface RawGapAnalysis {
  assessmentId: string
  studentId: string
  studentName: string
  periodName: string
  scaleMax: number
  dimensions: {
    dimensionId: string
    dimensionName: string
    selfScore: number | null
    mentorScore: number | null
    selfMentorGap: number | null
  }[]
}

function severityFor(gap: number, scaleMax: number): GapSeverity {
  const magnitude = Math.abs(gap) / (scaleMax || 1)
  if (magnitude === 0) return 'aligned'
  if (magnitude <= 0.2) return 'minor'
  return 'significant'
}

export function adaptGapAnalysis(raw: RawGapAnalysis): GapAnalysis {
  return {
    assessmentId: raw.assessmentId,
    studentId: raw.studentId,
    studentName: raw.studentName,
    periodName: raw.periodName,
    scoringScaleMax: raw.scaleMax,
    items: raw.dimensions.map((d) => {
      const self = d.selfScore ?? 0
      const mentor = d.mentorScore ?? 0
      const gap = d.selfMentorGap ?? mentor - self
      return {
        dimensionId: d.dimensionId,
        dimensionName: d.dimensionName,
        self,
        mentor,
        gap,
        severity: severityFor(gap, raw.scaleMax),
      }
    }),
  }
}
