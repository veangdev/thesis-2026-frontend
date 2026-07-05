import { ApiError } from '@/services/api-client'
import { scoreGap } from '@/lib/scoring'
import type { AnalyticsService } from '@/features/analytics/analytics.contract'
import type {
  ActivityFeedItem,
  CohortAnalytics,
  CohortHeatmapRow,
  CycleDimensionScore,
  DimensionAverage,
  GapAnalysis,
  MentorWorkload,
  OverviewAnalytics,
  StudentAnalytics,
  StudentCycle,
} from '@/features/analytics/analytics.types'
import type { Assessment } from '@/features/assessments/assessments.types'
import { ROLES } from '@/constants/roles'
import { getDb } from '../db'
import { delay } from '../latency'
import { trendForStudent } from '../seed/assessments.seed'

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return (
    Math.round(
      (values.reduce((sum, value) => sum + value, 0) / values.length) * 10
    ) / 10
  )
}

/** Best available score per dimension: agreed → mentor → self. */
function effectiveScore(
  assessment: Assessment,
  dimensionId: string
): number | null {
  const agreed = assessment.agreedScores.find(
    (score) => score.dimensionId === dimensionId
  )
  if (agreed) return agreed.score
  const mentor = assessment.mentorScores.find(
    (score) => score.dimensionId === dimensionId
  )
  if (mentor) return mentor.score
  const self = assessment.selfScores.find(
    (score) => score.dimensionId === dimensionId
  )
  return self ? self.score : null
}

function studentIndexOf(studentId: string): number {
  const students = getDb().users.filter(
    (user) => user.role === ROLES.SELF_ASSESSOR
  )
  return Math.max(
    0,
    students.findIndex((student) => student.id === studentId)
  )
}

function buildStudentAnalytics(studentId: string): StudentAnalytics {
  const db = getDb()
  const student = db.users.find((user) => user.id === studentId)
  if (!student) throw new ApiError('Student not found', 404)
  const cohort = db.cohorts.find(
    (candidate) => candidate.id === student.cohortId
  )
  if (!cohort) throw new ApiError('Student has no cohort', 404)

  const dimensions = db.dimensions
    .filter((dimension) => dimension.cohortId === cohort.id)
    .sort((a, b) => a.order - b.order)
  const periods = db.periods.filter((period) => period.cohortId === cohort.id)

  const cycles: StudentCycle[] = periods.map((period) => {
    const assessment = db.assessments.find(
      (candidate) =>
        candidate.studentId === studentId && candidate.periodId === period.id
    )
    const scores: CycleDimensionScore[] = dimensions.map((dimension) => {
      const self =
        assessment?.selfScores.find((s) => s.dimensionId === dimension.id)
          ?.score ?? null
      const mentor =
        assessment?.mentorScores.find((s) => s.dimensionId === dimension.id)
          ?.score ?? null
      const agreed =
        assessment?.agreedScores.find((s) => s.dimensionId === dimension.id)
          ?.score ?? null
      return {
        dimensionId: dimension.id,
        dimensionName: dimension.name,
        self,
        mentor,
        agreed,
      }
    })
    const effective = assessment
      ? (dimensions
          .map((dimension) => effectiveScore(assessment, dimension.id))
          .filter((value) => value !== null) as number[])
      : []
    return {
      periodId: period.id,
      periodName: period.name,
      average: average(effective),
      scores,
    }
  })

  return {
    studentId,
    studentName: student.name,
    cohortId: cohort.id,
    scoringScaleMax: cohort.scoringScaleMax,
    trend: trendForStudent(studentIndexOf(studentId)),
    cycles,
  }
}

export const mockAnalyticsService: AnalyticsService = {
  async student(studentId) {
    await delay()
    return buildStudentAnalytics(studentId)
  },

  async cohort(cohortId) {
    await delay()
    const db = getDb()
    const cohort = db.cohorts.find((candidate) => candidate.id === cohortId)
    if (!cohort) throw new ApiError('Cohort not found', 404)

    const dimensions = db.dimensions
      .filter((dimension) => dimension.cohortId === cohortId)
      .sort((a, b) => a.order - b.order)
    const periods = db.periods.filter((period) => period.cohortId === cohortId)
    const students = db.users.filter(
      (user) => user.role === ROLES.SELF_ASSESSOR && user.cohortId === cohortId
    )
    const completedPeriods = periods.filter((p) => p.status === 'completed')
    const latestCompleted = completedPeriods[completedPeriods.length - 1]

    const heatmap: CohortHeatmapRow[] = students.map((student) => {
      const assessment = db.assessments.find(
        (candidate) =>
          candidate.studentId === student.id &&
          candidate.periodId === latestCompleted?.id
      )
      const scores: Record<string, number | null> = {}
      for (const dimension of dimensions) {
        scores[dimension.id] = assessment
          ? effectiveScore(assessment, dimension.id)
          : null
      }
      const values = Object.values(scores).filter(
        (value) => value !== null
      ) as number[]
      return {
        studentId: student.id,
        studentName: student.name,
        trend: trendForStudent(studentIndexOf(student.id)),
        scores,
        average: average(values),
      }
    })

    const dimensionAverages: DimensionAverage[] = dimensions.map(
      (dimension) => ({
        dimensionId: dimension.id,
        dimensionName: dimension.name,
        average: average(
          heatmap
            .map((row) => row.scores[dimension.id])
            .filter((value) => value !== null) as number[]
        ),
      })
    )

    const weakestDimensions = [...dimensionAverages]
      .filter((entry) => entry.average !== null)
      .sort((a, b) => (a.average ?? 0) - (b.average ?? 0))
      .slice(0, 3)

    const trendline = periods.map((period) => {
      const cyclesScores: number[] = []
      for (const student of students) {
        const assessment = db.assessments.find(
          (candidate) =>
            candidate.studentId === student.id &&
            candidate.periodId === period.id
        )
        if (!assessment) continue
        const values = dimensions
          .map((dimension) => effectiveScore(assessment, dimension.id))
          .filter((value) => value !== null) as number[]
        const avg = average(values)
        if (avg !== null) cyclesScores.push(avg)
      }
      return {
        periodId: period.id,
        periodName: period.name,
        average: average(cyclesScores),
      }
    })

    const activePeriod = periods.find((period) => period.status === 'active')
    const activeAssessments = db.assessments.filter(
      (assessment) => assessment.periodId === activePeriod?.id
    )
    const participationRate =
      activeAssessments.length === 0
        ? 0
        : Math.round(
            (activeAssessments.filter((a) => a.status !== 'draft').length /
              activeAssessments.length) *
              100
          )

    return {
      cohortId,
      cohortName: cohort.name,
      scoringScaleMax: cohort.scoringScaleMax,
      participationRate,
      heatmap,
      dimensionAverages,
      weakestDimensions,
      trendline,
    } satisfies CohortAnalytics
  },

  async overview() {
    await delay()
    const db = getDb()
    const students = db.users.filter(
      (user) => user.role === ROLES.SELF_ASSESSOR
    )
    const facilitators = db.users.filter(
      (user) => user.role === ROLES.FACILITATOR
    )
    const activePeriodIds = new Set(
      db.periods.filter((p) => p.status === 'active').map((p) => p.id)
    )
    const activeAssessments = db.assessments.filter((assessment) =>
      activePeriodIds.has(assessment.periodId)
    )
    const completionRate =
      activeAssessments.length === 0
        ? 0
        : Math.round(
            (activeAssessments.filter((a) => a.status === 'completed').length /
              activeAssessments.length) *
              100
          )

    // At-risk = regressing archetype students.
    const atRiskCount = students.filter(
      (student, index) => trendForStudent(index) === 'regressing'
    ).length

    const mentorWorkload: MentorWorkload[] = facilitators.map(
      (facilitator) => ({
        facilitatorId: facilitator.id,
        facilitatorName: facilitator.name,
        studentCount: students.filter(
          (student) => student.facilitatorId === facilitator.id
        ).length,
        pendingReviews: activeAssessments.filter(
          (assessment) =>
            assessment.facilitatorId === facilitator.id &&
            (assessment.status === 'self_submitted' ||
              assessment.status === 'mentor_review')
        ).length,
      })
    )

    const recentAssessments = [...db.assessments]
      .filter((a) => a.status !== 'draft')
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 8)
    const activityFeed: ActivityFeedItem[] = recentAssessments.map(
      (assessment) => ({
        id: `feed-${assessment.id}`,
        message:
          assessment.status === 'completed'
            ? `${assessment.studentName} completed ${assessment.periodName}`
            : `${assessment.studentName} submitted a self-assessment (${assessment.periodName})`,
        timestamp: assessment.updatedAt,
        category: 'assessment',
      })
    )

    // Submissions per week over the last 6 weeks (relative to 2026-07-04 seed).
    const weeks = 6
    const now = Date.UTC(2026, 6, 4)
    const activityTrend = Array.from({ length: weeks }, (_, index) => {
      const end = now - (weeks - 1 - index) * 7 * 86400000
      const start = end - 7 * 86400000
      const count = db.assessments.filter((assessment) => {
        if (!assessment.selfSubmittedAt) return false
        const at = Date.parse(assessment.selfSubmittedAt)
        return at >= start && at < end
      }).length
      const label = new Date(end).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })
      return { label, count }
    })

    return {
      kpis: {
        totalStudents: students.length,
        totalFacilitators: facilitators.length,
        activeCohorts: db.cohorts.filter((c) => c.status === 'active').length,
        completionRate,
        atRiskCount,
      },
      mentorWorkload,
      activityFeed,
      activityTrend,
    } satisfies OverviewAnalytics
  },

  async gap(assessmentId) {
    await delay()
    const db = getDb()
    const assessment = db.assessments.find(
      (candidate) => candidate.id === assessmentId
    )
    if (!assessment) throw new ApiError('Assessment not found', 404)
    const cohort = db.cohorts.find(
      (candidate) => candidate.id === assessment.cohortId
    )
    const scaleMax = cohort?.scoringScaleMax ?? 5
    const dimensions = db.dimensions
      .filter((dimension) => dimension.cohortId === assessment.cohortId)
      .sort((a, b) => a.order - b.order)

    const items = dimensions.flatMap((dimension) => {
      const self = assessment.selfScores.find(
        (score) => score.dimensionId === dimension.id
      )
      const mentor = assessment.mentorScores.find(
        (score) => score.dimensionId === dimension.id
      )
      if (!self || !mentor) return []
      const gap = scoreGap(self.score, mentor.score, scaleMax)
      return [
        {
          dimensionId: dimension.id,
          dimensionName: dimension.name,
          self: self.score,
          mentor: mentor.score,
          gap: gap.value,
          severity: gap.severity,
          note: mentor.note,
        },
      ]
    })

    return {
      assessmentId,
      studentId: assessment.studentId,
      studentName: assessment.studentName,
      periodName: assessment.periodName,
      scoringScaleMax: scaleMax,
      items,
    } satisfies GapAnalysis
  },
}
