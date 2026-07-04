import { mockNotificationsService } from '@/mocks/services/notifications.mock'
import { pickService } from '@/services/service-factory'
import { realNotificationsService } from './notifications.service'

export const notificationsService = pickService(
  realNotificationsService,
  mockNotificationsService
)

export * from './notifications.types'
export type { NotificationsService } from './notifications.contract'
export { notificationKeys } from './notifications.keys'
export * from './notifications.hooks'
