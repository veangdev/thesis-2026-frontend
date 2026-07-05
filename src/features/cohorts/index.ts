import { mockCohortsService } from '@/mocks/services/cohorts.mock'
import { pickService } from '@/services/service-factory'
import { realCohortsService } from './cohorts.service'

export const cohortsService = pickService(
  realCohortsService,
  mockCohortsService
)

export * from './cohorts.types'
export type { CohortsService } from './cohorts.contract'
export { cohortKeys } from './cohorts.keys'
export * from './cohorts.hooks'
