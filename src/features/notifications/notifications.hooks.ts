'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationKeys } from './notifications.keys'
import type { NotificationListParams } from './notifications.types'
import { notificationsService } from './index'

export function useNotifications(params?: NotificationListParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsService.list(params),
    // Keep the topbar bell reasonably fresh.
    refetchInterval: 60_000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (error) =>
      toast.error(error.message || 'Failed to mark the notification read'),
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (error) =>
      toast.error(error.message || 'Failed to mark notifications read'),
  })
}
