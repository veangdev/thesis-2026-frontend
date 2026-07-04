/** Growth goal domain models. */

export type GoalStatus = 'active' | 'achieved' | 'archived'

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: 'Active',
  achieved: 'Achieved',
  archived: 'Archived',
}

export interface Goal {
  id: string
  studentId: string
  /** Dimension this goal targets, when linked. */
  dimensionId?: string
  dimensionName?: string
  title: string
  description?: string
  targetScore?: number
  /** 0–100 completion, self-reported or derived. */
  progress: number
  status: GoalStatus
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface GoalListParams {
  page?: number
  pageSize?: number
  studentId?: string
  status?: GoalStatus
}

export interface GoalPayload {
  title: string
  description?: string
  dimensionId?: string
  targetScore?: number
  progress?: number
  status?: GoalStatus
  dueDate?: string
  studentId?: string
}
