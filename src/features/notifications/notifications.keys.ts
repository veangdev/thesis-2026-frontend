import type { NotificationListParams } from './notifications.types'

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: NotificationListParams) =>
    [...notificationKeys.lists(), params ?? {}] as const,
}
