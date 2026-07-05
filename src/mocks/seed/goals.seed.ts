import type { Goal } from '@/features/goals/goals.types'
import type { Dimension } from '@/features/cohorts/cohorts.types'
import type { User } from '@/types/auth'
import type { Random } from '../random'

const GOAL_TEMPLATES = [
  'Speak up at least once in every team meeting',
  'Lead one group activity this cycle',
  'Finish every task before its deadline for a month',
  'Ask for feedback after each project milestone',
  'Practise a mock interview every two weeks',
  'Keep a weekly learning journal',
]

interface SeedGoalsInput {
  students: User[]
  dimensions: Dimension[]
  rng: Random
}

/** 1–3 goals per student, linked to a dimension where it makes sense. */
export function seedGoals({
  students,
  dimensions,
  rng,
}: SeedGoalsInput): Goal[] {
  const goals: Goal[] = []
  let counter = 0

  for (const [index, student] of students.entries()) {
    const cohortDimensions = dimensions.filter(
      (d) => d.cohortId === student.cohortId
    )
    // Demo student gets a rich set; others 1–2.
    const count = index === 0 ? 3 : rng.int(1, 2)

    for (let i = 0; i < count; i += 1) {
      counter += 1
      const dimension = rng.chance(0.75)
        ? rng.pick(cohortDimensions)
        : undefined
      const progress = rng.int(10, 95)
      goals.push({
        id: `goal-${counter}`,
        studentId: student.id,
        dimensionId: dimension?.id,
        dimensionName: dimension?.name,
        title: rng.pick(GOAL_TEMPLATES),
        description: 'Agreed with my mentor during the last coaching session.',
        targetScore: undefined,
        progress: progress > 88 ? 100 : progress,
        status: progress > 88 ? 'achieved' : 'active',
        dueDate: `2026-0${rng.int(7, 9)}-15`,
        createdAt: '2026-06-05T09:00:00.000Z',
        updatedAt: '2026-06-28T09:00:00.000Z',
      })
    }
  }

  return goals
}
