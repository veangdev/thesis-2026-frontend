import { mockGoalsService } from '@/mocks/services/goals.mock'
import { pickService } from '@/services/service-factory'
import { realGoalsService } from './goals.service'

export const goalsService = pickService(realGoalsService, mockGoalsService)

export * from './goals.types'
export type { GoalsService } from './goals.contract'
export { goalKeys } from './goals.keys'
export * from './goals.hooks'
