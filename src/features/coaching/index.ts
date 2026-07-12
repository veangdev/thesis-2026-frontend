import { mockCoachingService } from '@/mocks/services/coaching.mock'
import { pickService } from '@/services/service-factory'
import { realCoachingService } from './coaching.service'

export const coachingService = pickService(
  realCoachingService,
  mockCoachingService
)

export * from './coaching.types'
export type { CoachingService } from './coaching.contract'
export { coachingKeys } from './coaching.keys'
export * from './coaching.hooks'
