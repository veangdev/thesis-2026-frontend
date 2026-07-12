import { mockAnalyticsService } from '@/mocks/services/analytics.mock'
import { pickService } from '@/services/service-factory'
import { realAnalyticsService } from './analytics.service'

export const analyticsService = pickService(
  realAnalyticsService,
  mockAnalyticsService
)

export * from './analytics.types'
export type { AnalyticsService } from './analytics.contract'
export { analyticsKeys } from './analytics.keys'
export * from './analytics.hooks'
