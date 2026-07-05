import type { AuditLog } from '@/features/audit/audit.types'
import type { User } from '@/types/auth'

interface SeedAuditInput {
  coordinator: User
  facilitators: User[]
}

/** A believable trail of coordinator/facilitator activity. */
export function seedAudit({
  coordinator,
  facilitators,
}: SeedAuditInput): AuditLog[] {
  const entries: Omit<AuditLog, 'id'>[] = [
    {
      actorId: coordinator.id,
      actorName: coordinator.name,
      action: 'period.created',
      entity: 'period',
      entityId: 'period-cohort-1-4',
      details: 'Created "Cycle 4 — Mastery" (Jun 1 – Jul 31)',
      timestamp: '2026-05-20T08:12:00.000Z',
    },
    {
      actorId: coordinator.id,
      actorName: coordinator.name,
      action: 'period.created',
      entity: 'period',
      entityId: 'period-cohort-2-4',
      details: 'Created "Cycle 4 — Mastery" (Jun 1 – Jul 31)',
      timestamp: '2026-05-20T08:14:00.000Z',
    },
    {
      actorId: coordinator.id,
      actorName: coordinator.name,
      action: 'cohort.scale_changed',
      entity: 'cohort',
      entityId: 'cohort-3',
      details: 'Scoring scale set to 10 (pilot)',
      timestamp: '2026-05-18T10:02:00.000Z',
    },
    {
      actorId: coordinator.id,
      actorName: coordinator.name,
      action: 'user.bulk_imported',
      entity: 'user',
      details: 'Imported 8 students into Data & AI pilot',
      timestamp: '2026-05-15T09:30:00.000Z',
    },
    {
      actorId: facilitators[0].id,
      actorName: facilitators[0].name,
      action: 'assessment.reviewed',
      entity: 'assessment',
      entityId: 'assessment-user-student-2-period-cohort-1-3',
      details: 'Completed mentor review for Cycle 3',
      timestamp: '2026-04-28T14:40:00.000Z',
    },
    {
      actorId: facilitators[1].id,
      actorName: facilitators[1].name,
      action: 'coaching.scheduled',
      entity: 'coaching-session',
      details: 'Scheduled group session on Teamwork',
      timestamp: '2026-06-22T11:05:00.000Z',
    },
    {
      actorId: coordinator.id,
      actorName: coordinator.name,
      action: 'assignment.updated',
      entity: 'assignment',
      details: 'Rebalanced two students between mentors',
      timestamp: '2026-06-10T15:21:00.000Z',
    },
    {
      actorId: coordinator.id,
      actorName: coordinator.name,
      action: 'dimension.updated',
      entity: 'dimension',
      entityId: 'dim-cohort-1-7',
      details: 'Clarified Critical Thinking description',
      timestamp: '2026-03-02T09:00:00.000Z',
    },
    {
      actorId: facilitators[2].id,
      actorName: facilitators[2].name,
      action: 'assessment.reviewed',
      entity: 'assessment',
      details: 'Completed 4 mentor reviews for Cycle 3',
      timestamp: '2026-04-25T16:12:00.000Z',
    },
    {
      actorId: coordinator.id,
      actorName: coordinator.name,
      action: 'notification.rule_updated',
      entity: 'settings',
      details: 'Enabled weekly completion digest',
      timestamp: '2026-06-01T08:00:00.000Z',
    },
  ]

  return entries.map((entry, index) => ({ id: `audit-${index + 1}`, ...entry }))
}
