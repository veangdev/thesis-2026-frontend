import type { PaginatedResponse } from '@/types/common'
import type {
  Assessment,
  AssessmentListParams,
  MentorAssessmentPayload,
  SelfAssessmentPayload,
} from './assessments.types'

/** Shared interface implemented by the real and mock assessment services. */
export interface AssessmentsService {
  list(params?: AssessmentListParams): Promise<PaginatedResponse<Assessment>>
  getById(id: string): Promise<Assessment>

  /** Save self-assessment draft (student). */
  saveSelf(id: string, payload: SelfAssessmentPayload): Promise<Assessment>
  /** Submit self-assessment: draft → self_submitted (student). */
  submitSelf(id: string): Promise<Assessment>

  /** Save mentor review progress: self_submitted → mentor_review (facilitator). */
  saveMentor(id: string, payload: MentorAssessmentPayload): Promise<Assessment>
  /** Finalize: agreed → completed (facilitator). */
  submitMentor(id: string): Promise<Assessment>
}
