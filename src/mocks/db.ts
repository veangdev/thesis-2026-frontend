import type { Assessment } from '@/features/assessments/assessments.types'
import type { AuditLog } from '@/features/audit/audit.types'
import type { CoachingSession } from '@/features/coaching/coaching.types'
import type {
  Cohort,
  Dimension,
  Period,
} from '@/features/cohorts/cohorts.types'
import type { Goal } from '@/features/goals/goals.types'
import type { AppNotification } from '@/features/notifications/notifications.types'
import type { Assignment } from '@/features/users/users.types'
import type { User } from '@/types/auth'
import { createRandom } from './random'
import { seedAssessments } from './seed/assessments.seed'
import { seedAudit } from './seed/audit.seed'
import { seedCoaching } from './seed/coaching.seed'
import { seedCohorts } from './seed/cohorts.seed'
import { seedGoals } from './seed/goals.seed'
import { seedNotifications } from './seed/notifications.seed'
import { seedUsers } from './seed/users.seed'

export interface MockDb {
  users: User[]
  cohorts: Cohort[]
  dimensions: Dimension[]
  periods: Period[]
  assignments: Assignment[]
  assessments: Assessment[]
  coachingSessions: CoachingSession[]
  goals: Goal[]
  notifications: AppNotification[]
  auditLogs: AuditLog[]
  /** Monotonic counter for ids created at runtime. */
  nextId: () => string
}

/** Students per cohort: 12 / 10 / 8 (spec §4: 3 cohorts, 30 students). */
const COHORT_SIZES = [12, 10, 8]

function buildDb(): MockDb {
  const rng = createRandom(20260704)
  const { coordinator, facilitators, students, all } = seedUsers()
  const { cohorts, dimensions, periods } = seedCohorts()

  // Link students to cohorts (contiguous blocks) and facilitators (round-robin
  // within the cohort so rosters are balanced). student-1 lands in cohort-1
  // with facilitator-1 — the demo pairing.
  let cursor = 0
  cohorts.forEach((cohort, cohortIndex) => {
    const block = students.slice(cursor, cursor + COHORT_SIZES[cohortIndex])
    block.forEach((student, index) => {
      student.cohortId = cohort.id
      student.facilitatorId = facilitators[index % facilitators.length].id
    })
    cursor += COHORT_SIZES[cohortIndex]
  })

  const assignments: Assignment[] = students.map((student, index) => ({
    id: `assignment-${index + 1}`,
    facilitatorId: student.facilitatorId as string,
    studentId: student.id,
    cohortId: student.cohortId as string,
    createdAt: '2025-10-01T08:00:00.000Z',
  }))

  const assessments = seedAssessments({
    students,
    cohorts,
    dimensions,
    periods,
    rng,
  })
  const coachingSessions = seedCoaching({
    facilitators,
    students,
    dimensions,
    rng,
  })
  const goals = seedGoals({ students, dimensions, rng })
  const notifications = seedNotifications({
    coordinator,
    facilitators,
    students,
  })
  const auditLogs = seedAudit({ coordinator, facilitators })

  let runtimeId = 1000
  return {
    users: all,
    cohorts,
    dimensions,
    periods,
    assignments,
    assessments,
    coachingSessions,
    goals,
    notifications,
    auditLogs,
    nextId: () => `mock-${(runtimeId += 1)}`,
  }
}

/**
 * Session-lifetime singleton: mutations persist across queries so demo flows
 * round-trip (submit self-assessment → it appears in the mentor queue), and a
 * page reload re-seeds deterministically.
 */
let db: MockDb | null = null

export function getDb(): MockDb {
  if (!db) db = buildDb()
  return db
}
