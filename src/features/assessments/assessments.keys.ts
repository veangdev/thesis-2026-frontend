import type { AssessmentListParams } from './assessments.types'

export const assessmentKeys = {
  all: ['assessments'] as const,
  lists: () => [...assessmentKeys.all, 'list'] as const,
  list: (params?: AssessmentListParams) =>
    [...assessmentKeys.lists(), params ?? {}] as const,
  detail: (id: string) => [...assessmentKeys.all, 'detail', id] as const,
}
