import type {
  AgreedScore,
  Assessment,
  AssessmentStatus,
  CoachingTag,
  MentorScore,
  SelfScore,
} from '@/features/assessments/assessments.types'
import type { Trend } from '@/features/analytics/analytics.types'
import type {
  Cohort,
  Dimension,
  Period,
} from '@/features/cohorts/cohorts.types'
import type { User } from '@/types/auth'
import type { Random } from '../random'

/**
 * Growth archetypes (spec §4): every student follows one so multi-cycle
 * charts show clearly improving, stagnant, and regressing journeys.
 * Values are fractions of the cohort's scale.
 */
const ARCHETYPES: Record<Trend, { base: number; perCycle: number }> = {
  improving: { base: 0.38, perCycle: 0.13 },
  stagnant: { base: 0.55, perCycle: 0.0 },
  regressing: { base: 0.72, perCycle: -0.09 },
}

export const STUDENT_TRENDS: Trend[] = ['improving', 'stagnant', 'regressing']

/** Deterministic archetype per student: ~half improving, quarter each other. */
export function trendForStudent(studentIndex: number): Trend {
  const pattern: Trend[] = ['improving', 'stagnant', 'improving', 'regressing']
  return pattern[studentIndex % pattern.length]
}

const REFLECTIONS = [
  'I practised this every week and can feel the difference.',
  'Still finding this hard in group settings, but I keep trying.',
  'My mentor gave me exercises that really helped.',
  'I want to focus more on this next cycle.',
  'Working on the class project pushed me here.',
]

const MENTOR_NOTES = [
  'Clear progress since the last cycle — keep the momentum.',
  'We discussed concrete situations; needs steady practice.',
  'Strong in one-on-ones, less confident in groups.',
  'Recommended pairing with a peer mentor for this dimension.',
  'Solid foundation; ready for a stretch goal.',
]

const COACHING_TAGS: CoachingTag[] = [
  'needs_focus',
  'on_track',
  'strength',
  'coaching_recommended',
]

function clampScore(value: number, scaleMax: number): number {
  return Math.min(scaleMax, Math.max(1, Math.round(value)))
}

interface SeedAssessmentsInput {
  students: User[]
  cohorts: Cohort[]
  dimensions: Dimension[]
  periods: Period[]
  rng: Random
}

/**
 * One assessment per student per period. Completed periods get the full
 * self → mentor → agreed record; the active period gets a varied mix of
 * statuses so every portal has work to show.
 *
 * Guarantees for the demo flows:
 * - student-1 (student@pnc.edu) has a fresh `draft` in the active period.
 * - facilitator-1's roster contains `self_submitted` items ready to review.
 */
export function seedAssessments({
  students,
  cohorts,
  dimensions,
  periods,
  rng,
}: SeedAssessmentsInput): Assessment[] {
  const assessments: Assessment[] = []

  for (const [studentIndex, student] of students.entries()) {
    const cohort = cohorts.find((c) => c.id === student.cohortId)
    if (!cohort) continue
    const cohortDimensions = dimensions.filter((d) => d.cohortId === cohort.id)
    const cohortPeriods = periods.filter((p) => p.cohortId === cohort.id)
    const trend = trendForStudent(studentIndex)
    const archetype = ARCHETYPES[trend]

    for (const [cycleIndex, period] of cohortPeriods.entries()) {
      const isActive = period.status === 'active'
      const scaleMax = cohort.scoringScaleMax

      // Per-dimension personal offset keeps radars organic, not circular.
      const buildScores = () => {
        const selfScores: SelfScore[] = []
        const mentorScores: MentorScore[] = []
        const agreedScores: AgreedScore[] = []
        for (const dimension of cohortDimensions) {
          const dimensionOffset = (rng.next() - 0.5) * 0.24
          const level =
            archetype.base + archetype.perCycle * cycleIndex + dimensionOffset
          const self = clampScore(
            level * scaleMax + rng.int(-1, 1) * 0.3,
            scaleMax
          )
          const mentorDrift = rng.chance(0.6) ? 0 : rng.pick([-1, 1])
          const mentor = clampScore(self + mentorDrift, scaleMax)
          const agreed = clampScore((self + mentor) / 2 + 0.001, scaleMax)
          selfScores.push({
            dimensionId: dimension.id,
            score: self,
            reflection: rng.chance(0.7) ? rng.pick(REFLECTIONS) : undefined,
          })
          mentorScores.push({
            dimensionId: dimension.id,
            score: mentor,
            note: rng.chance(0.8) ? rng.pick(MENTOR_NOTES) : undefined,
            coachingTag: rng.chance(0.6) ? rng.pick(COACHING_TAGS) : undefined,
          })
          agreedScores.push({ dimensionId: dimension.id, score: agreed })
        }
        return { selfScores, mentorScores, agreedScores }
      }

      let status: AssessmentStatus
      if (!isActive) {
        status = 'completed'
      } else if (studentIndex === 0) {
        // Demo student always starts the active cycle from a clean draft.
        status = 'draft'
      } else {
        // Spread active-period statuses across the machine deterministically.
        const spread: AssessmentStatus[] = [
          'self_submitted',
          'draft',
          'mentor_review',
          'self_submitted',
          'agreed',
          'completed',
        ]
        status = spread[studentIndex % spread.length]
      }

      const scores =
        status === 'draft'
          ? { selfScores: [], mentorScores: [], agreedScores: [] }
          : buildScores()

      const includeMentor =
        status === 'mentor_review' ||
        status === 'agreed' ||
        status === 'completed'
      const includeAgreed = status === 'agreed' || status === 'completed'

      const baseDate = new Date(`${period.startDate}T09:00:00.000Z`)
      const submittedAt = new Date(baseDate.getTime() + 12 * 86400000)
      const completedAt = new Date(baseDate.getTime() + 30 * 86400000)

      assessments.push({
        id: `assessment-${student.id}-${period.id}`,
        studentId: student.id,
        studentName: student.name,
        cohortId: cohort.id,
        periodId: period.id,
        periodName: period.name,
        facilitatorId: student.facilitatorId,
        status,
        selfScores: scores.selfScores,
        mentorScores: includeMentor ? scores.mentorScores : [],
        agreedScores: includeAgreed ? scores.agreedScores : [],
        overallReflection:
          status !== 'draft' && rng.chance(0.7)
            ? 'This cycle I focused on practising with my team every week.'
            : undefined,
        overallFeedback: includeAgreed
          ? 'Consistent effort this cycle — we agreed on clear next steps.'
          : undefined,
        selfSubmittedAt:
          status !== 'draft' ? submittedAt.toISOString() : undefined,
        completedAt:
          status === 'completed' ? completedAt.toISOString() : undefined,
        createdAt: baseDate.toISOString(),
        updatedAt:
          status === 'completed'
            ? completedAt.toISOString()
            : submittedAt.toISOString(),
      })
    }
  }

  return assessments
}
