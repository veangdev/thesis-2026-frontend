import type { PaginatedResponse } from '@/types/common'
import type {
  AppNotification,
  NotificationListParams,
} from './notifications.types'

/** Shared interface implemented by the real and mock notification services. */
export interface NotificationsService {
  list(
    params?: NotificationListParams
  ): Promise<PaginatedResponse<AppNotification>>
  markRead(id: string): Promise<AppNotification>
  markAllRead(): Promise<void>
}
