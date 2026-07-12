'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { assessmentKeys } from './assessments.keys'
import type {
  AssessmentListParams,
  MentorAssessmentPayload,
  SelfAssessmentPayload,
} from './assessments.types'
import { assessmentsService } from './index'

export function useAssessments(params?: AssessmentListParams) {
  return useQuery({
    queryKey: assessmentKeys.list(params),
    queryFn: () => assessmentsService.list(params),
  })
}

export function useAssessment(id: string | undefined) {
  return useQuery({
    queryKey: assessmentKeys.detail(id ?? ''),
    queryFn: () => assessmentsService.getById(id as string),
    enabled: !!id,
  })
}

function useAssessmentMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  errorMessage: string
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: assessmentKeys.all }),
    onError: (error) => toast.error(error.message || errorMessage),
  })
}

export function useSaveSelfAssessment() {
  return useAssessmentMutation(
    ({ id, payload }: { id: string; payload: SelfAssessmentPayload }) =>
      assessmentsService.saveSelf(id, payload),
    'Failed to save your assessment'
  )
}

export function useSubmitSelfAssessment() {
  return useAssessmentMutation(
    (id: string) => assessmentsService.submitSelf(id),
    'Failed to submit your assessment'
  )
}

export function useSaveMentorAssessment() {
  return useAssessmentMutation(
    ({ id, payload }: { id: string; payload: MentorAssessmentPayload }) =>
      assessmentsService.saveMentor(id, payload),
    'Failed to save the review'
  )
}

export function useSubmitMentorAssessment() {
  return useAssessmentMutation(
    (id: string) => assessmentsService.submitMentor(id),
    'Failed to finalize the assessment'
  )
}
