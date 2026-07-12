import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { AssessmentsService } from './assessments.contract'
import type {
  Assessment,
  AssessmentListParams,
  MentorAssessmentPayload,
  SelfAssessmentPayload,
} from './assessments.types'

/** Real implementation backed by the REST API. */
export const realAssessmentsService: AssessmentsService = {
  list(params?: AssessmentListParams): Promise<PaginatedResponse<Assessment>> {
    return apiClient.get(API_ENDPOINTS.assessments.root, {
      params: { ...params },
    })
  },
  getById(id: string): Promise<Assessment> {
    return apiClient.get(API_ENDPOINTS.assessments.byId(id))
  },

  saveSelf(id: string, payload: SelfAssessmentPayload): Promise<Assessment> {
    return apiClient.put(API_ENDPOINTS.assessments.self(id), payload)
  },
  submitSelf(id: string): Promise<Assessment> {
    return apiClient.post(API_ENDPOINTS.assessments.selfSubmit(id))
  },

  saveMentor(
    id: string,
    payload: MentorAssessmentPayload
  ): Promise<Assessment> {
    return apiClient.put(API_ENDPOINTS.assessments.mentor(id), payload)
  },
  submitMentor(id: string): Promise<Assessment> {
    return apiClient.post(API_ENDPOINTS.assessments.mentorSubmit(id))
  },
}
