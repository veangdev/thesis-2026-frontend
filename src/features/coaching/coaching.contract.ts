import type { PaginatedResponse } from '@/types/common'
import type {
  ActionItem,
  ActionItemPayload,
  CoachingListParams,
  CoachingSession,
  CoachingSessionPayload,
} from './coaching.types'

/** Shared interface implemented by the real and mock coaching services. */
export interface CoachingService {
  list(params?: CoachingListParams): Promise<PaginatedResponse<CoachingSession>>
  getById(id: string): Promise<CoachingSession>
  create(payload: CoachingSessionPayload): Promise<CoachingSession>
  update(
    id: string,
    payload: Partial<CoachingSessionPayload>
  ): Promise<CoachingSession>
  remove(id: string): Promise<void>

  createActionItem(
    sessionId: string,
    payload: ActionItemPayload
  ): Promise<ActionItem>
  updateActionItem(
    id: string,
    payload: Partial<ActionItemPayload>
  ): Promise<ActionItem>
  deleteActionItem(id: string): Promise<void>
}
