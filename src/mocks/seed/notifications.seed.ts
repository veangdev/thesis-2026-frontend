import type { AppNotification } from '@/features/notifications/notifications.types'
import { ROUTES } from '@/constants/routes'
import type { User } from '@/types/auth'

interface SeedNotificationsInput {
  coordinator: User
  facilitators: User[]
  students: User[]
}

/**
 * Realistic unread/read mix for the three demo accounts (other users get a
 * couple each so the coordinator views don't look empty).
 */
export function seedNotifications({
  coordinator,
  facilitators,
  students,
}: SeedNotificationsInput): AppNotification[] {
  const notifications: AppNotification[] = []
  let counter = 0

  const push = (
    userId: string,
    category: AppNotification['category'],
    title: string,
    body: string,
    read: boolean,
    href?: string,
    daysAgo = 1
  ) => {
    counter += 1
    const createdAt = new Date(
      Date.UTC(2026, 6, 4) - daysAgo * 86400000
    ).toISOString()
    notifications.push({
      id: `notification-${counter}`,
      userId,
      category,
      title,
      body,
      read,
      href,
      createdAt,
    })
  }

  const student = students[0]
  push(
    student.id,
    'assessment',
    'Cycle 4 self-assessment is open',
    'Your Mastery cycle assessment is ready — score yourself across all 8 dimensions.',
    false,
    ROUTES.assessments,
    0
  )
  push(
    student.id,
    'coaching',
    'Coaching session scheduled',
    'Your mentor booked a session for next week. Check the time and prepare your notes.',
    false,
    ROUTES.coaching,
    1
  )
  push(
    student.id,
    'goal',
    'Goal progress nudge',
    'You are 70% of the way on "Speak up in every team meeting" — keep going!',
    false,
    ROUTES.goals,
    2
  )
  push(
    student.id,
    'assessment',
    'Cycle 3 results are in',
    'Your mentor review is complete. See how your star has grown.',
    true,
    ROUTES.journeyStar,
    20
  )
  push(
    student.id,
    'system',
    'Welcome to Journey Star',
    'Track your growth from first day at PNC to first day of employment.',
    true,
    ROUTES.dashboard,
    60
  )

  const facilitator = facilitators[0]
  push(
    facilitator.id,
    'assessment',
    '2 self-assessments ready for review',
    'Students submitted their Cycle 4 self-assessments and are waiting for your review.',
    false,
    ROUTES.assessments,
    0
  )
  push(
    facilitator.id,
    'coaching',
    'Follow-up due this week',
    'A follow-up from your June coaching session is due. Review the action items.',
    false,
    ROUTES.coaching,
    1
  )
  push(
    facilitator.id,
    'system',
    'Cycle 4 period is active',
    'The Mastery cycle runs June 1 – July 31. Completion tracking has started.',
    true,
    ROUTES.dashboard,
    30
  )

  push(
    coordinator.id,
    'assessment',
    'Cycle 4 completion at 42%',
    'Assessment completion is trailing last cycle. See which cohorts are behind.',
    false,
    ROUTES.assessments,
    0
  )
  push(
    coordinator.id,
    'system',
    '10-point pilot cohort feedback',
    'The Data & AI pilot cohort finished a full cycle on the 10-point scale.',
    false,
    ROUTES.settings,
    2
  )
  push(
    coordinator.id,
    'coaching',
    'Facilitator workload imbalance',
    'One facilitator has 8 pending reviews while others have none. Consider rebalancing.',
    true,
    ROUTES.teams,
    4
  )

  // Light noise for everyone else so lists never look broken.
  for (const other of [...facilitators.slice(1), ...students.slice(1, 6)]) {
    push(
      other.id,
      'system',
      'Cycle 4 period is active',
      'The Mastery cycle is open — see your dashboard for what to do next.',
      true,
      ROUTES.dashboard,
      14
    )
  }

  return notifications
}
