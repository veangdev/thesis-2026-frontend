/** Coaching session domain models. Scopes per spec §3. */

export type CoachingScope = 'individual' | 'group' | 'class' | 'batch'

export const COACHING_SCOPE_LABELS: Record<CoachingScope, string> = {
  individual: 'Individual',
  group: 'Group',
  class: 'Class',
  batch: 'Batch',
}

export type CoachingSessionStatus = 'scheduled' | 'completed' | 'cancelled'

export interface ActionItem {
  id: string
  sessionId: string
  title: string
  done: boolean
  assigneeId?: string
  assigneeName?: string
  dueDate?: string
  createdAt: string
}

export interface CoachingSession {
  id: string
  title: string
  scope: CoachingScope
  status: CoachingSessionStatus
  facilitatorId: string
  facilitatorName: string
  /** Students involved; a single id for `individual` scope. */
  participantIds: string[]
  participantNames: string[]
  cohortId?: string
  /** Dimensions the session focuses on. */
  dimensionIds: string[]
  notes?: string
  scheduledAt: string
  durationMinutes: number
  followUpAt?: string
  actionItems: ActionItem[]
  createdAt: string
}

export interface CoachingListParams {
  page?: number
  pageSize?: number
  facilitatorId?: string
  studentId?: string
  cohortId?: string
  status?: CoachingSessionStatus
  scope?: CoachingScope
  /** ISO month filter for calendar views, e.g. `2026-07`. */
  month?: string
}

export interface CoachingSessionPayload {
  title: string
  scope: CoachingScope
  participantIds: string[]
  cohortId?: string
  dimensionIds?: string[]
  notes?: string
  scheduledAt: string
  durationMinutes?: number
  followUpAt?: string
  status?: CoachingSessionStatus
}

export interface ActionItemPayload {
  title: string
  assigneeId?: string
  dueDate?: string
  done?: boolean
}
