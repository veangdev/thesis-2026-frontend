'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { settingsService, type NotificationRule } from './settings.service'

const NOTIFICATION_RULES_KEY = ['settings', 'notification-rules'] as const

export function useNotificationRules() {
  return useQuery({
    queryKey: NOTIFICATION_RULES_KEY,
    queryFn: () => settingsService.getNotificationRules(),
  })
}

/**
 * Toggles a notification rule with an optimistic cache update so the switch
 * flips instantly and rolls back if the request fails.
 */
export function useUpdateNotificationRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      settingsService.updateNotificationRule(key, enabled),
    onMutate: async ({ key, enabled }) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_RULES_KEY })
      const previous = queryClient.getQueryData<NotificationRule[]>(
        NOTIFICATION_RULES_KEY
      )
      queryClient.setQueryData<NotificationRule[]>(
        NOTIFICATION_RULES_KEY,
        (old = []) => [...old.filter((r) => r.key !== key), { key, enabled }]
      )
      return { previous }
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATION_RULES_KEY, context.previous)
      }
      toast.error(error.message || 'Failed to update the notification rule')
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_RULES_KEY }),
  })
}
