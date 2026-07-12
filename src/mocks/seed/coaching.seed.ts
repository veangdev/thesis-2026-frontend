import type {
  ActionItem,
  CoachingScope,
  CoachingSession,
  CoachingSessionStatus,
} from '@/features/coaching/coaching.types'
import type { Dimension } from '@/features/cohorts/cohorts.types'
import type { User } from '@/types/auth'
import type { Random } from '../random'

const SESSION_TITLES = [
  'Communication practice — presenting with confidence',
  'Teamwork retrospective after the group project',
  'Resilience check-in',
  'Career readiness: interview role-play',
  'Goal-setting for the new cycle',
  'Peer-feedback workshop',
  'Time management deep-dive',
  'Growth review — celebrating progress',
]

const ACTION_TITLES = [
  'Prepare a 5-minute talk for next class',
  'Write a reflection after each team meeting',
  'Pair with a study buddy twice a week',
  'Ask one question in every lecture',
  'Draft two interview answers using STAR',
  'Review feedback notes before Friday',
]

interface SeedCoachingInput {
  facilitators: User[]
  students: User[]
  dimensions: Dimension[]
  rng: Random
}

/** 3 sessions per facilitator across scopes/statuses + action items. */
export function seedCoaching({
  facilitators,
  students,
  dimensions,
  rng,
}: SeedCoachingInput): CoachingSession[] {
  const sessions: CoachingSession[] = []
  const scopes: CoachingScope[] = ['individual', 'group', 'class', 'batch']
  const statuses: CoachingSessionStatus[] = [
    'completed',
    'scheduled',
    'scheduled',
  ]

  let sessionCounter = 0
  let actionCounter = 0

  for (const facilitator of facilitators) {
    const roster = students.filter((s) => s.facilitatorId === facilitator.id)
    if (roster.length === 0) continue

    for (let index = 0; index < 3; index += 1) {
      sessionCounter += 1
      const scope = scopes[(sessionCounter + index) % scopes.length]
      const status = statuses[index % statuses.length]
      const participants =
        scope === 'individual'
          ? [rng.pick(roster)]
          : roster.slice(0, scope === 'group' ? 3 : roster.length)
      const cohortId = participants[0]?.cohortId
      const cohortDimensions = dimensions.filter((d) => d.cohortId === cohortId)

      // Completed sessions sit in June 2026; scheduled ones in July.
      const day = rng.int(2, 26)
      const scheduledAt =
        status === 'completed'
          ? `2026-06-${String(day).padStart(2, '0')}T09:30:00.000Z`
          : `2026-07-${String(day).padStart(2, '0')}T14:00:00.000Z`

      const actionItems: ActionItem[] = Array.from(
        { length: rng.int(1, 3) },
        () => {
          actionCounter += 1
          return {
            id: `action-${actionCounter}`,
            sessionId: `coaching-${sessionCounter}`,
            title: rng.pick(ACTION_TITLES),
            done: status === 'completed' ? rng.chance(0.6) : false,
            assigneeId: rng.pick(participants).id,
            dueDate: `2026-07-${String(rng.int(10, 28)).padStart(2, '0')}`,
            createdAt: scheduledAt,
          }
        }
      )

      sessions.push({
        id: `coaching-${sessionCounter}`,
        title: rng.pick(SESSION_TITLES),
        scope,
        status,
        facilitatorId: facilitator.id,
        facilitatorName: facilitator.name,
        participantIds: participants.map((p) => p.id),
        participantNames: participants.map((p) => p.name),
        cohortId,
        dimensionIds: [rng.pick(cohortDimensions)?.id].filter(
          Boolean
        ) as string[],
        notes:
          status === 'completed'
            ? 'Good energy — we agreed on the action items below.'
            : undefined,
        scheduledAt,
        durationMinutes: rng.pick([30, 45, 60]),
        followUpAt:
          status === 'completed' && rng.chance(0.5)
            ? `2026-07-${String(rng.int(15, 30)).padStart(2, '0')}T10:00:00.000Z`
            : undefined,
        actionItems,
        createdAt: scheduledAt,
      })
    }
  }

  return sessions
}
