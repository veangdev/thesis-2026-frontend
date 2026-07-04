import { mockAssessmentsService } from '@/mocks/services/assessments.mock'
import { pickService } from '@/services/service-factory'
import { realAssessmentsService } from './assessments.service'

export const assessmentsService = pickService(
  realAssessmentsService,
  mockAssessmentsService
)

export * from './assessments.types'
export type { AssessmentsService } from './assessments.contract'
export { assessmentKeys } from './assessments.keys'
export * from './assessments.hooks'
