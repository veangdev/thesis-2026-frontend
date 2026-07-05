import type { PaginatedResponse } from '@/types/common'
import type { Goal, GoalListParams, GoalPayload } from './goals.types'

/** Shared interface implemented by the real and mock goal services. */
export interface GoalsService {
  list(params?: GoalListParams): Promise<PaginatedResponse<Goal>>
  getById(id: string): Promise<Goal>
  create(payload: GoalPayload): Promise<Goal>
  update(id: string, payload: Partial<GoalPayload>): Promise<Goal>
  remove(id: string): Promise<void>
}
