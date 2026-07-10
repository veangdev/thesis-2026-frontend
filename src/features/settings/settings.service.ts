import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'

export interface NotificationRule {
  key: string
  enabled: boolean
}

/**
 * Program-wide settings. Notification rules are coordinator-only toggles stored
 * on the backend; keys the coordinator has never touched simply aren't returned
 * and the UI falls back to its built-in defaults.
 */
export const settingsService = {
  getNotificationRules(): Promise<NotificationRule[]> {
    return apiClient.get<NotificationRule[]>(
      API_ENDPOINTS.settings.notificationRules
    )
  },
  updateNotificationRule(
    key: string,
    enabled: boolean
  ): Promise<NotificationRule> {
    return apiClient.patch<NotificationRule>(
      API_ENDPOINTS.settings.notificationRule(key),
      { enabled }
    )
  },
}
