import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { NotificationsService } from './notifications.contract'

/** Real implementation backed by the REST API. */
export const realNotificationsService: NotificationsService = {
  list(params) {
    return apiClient.get(API_ENDPOINTS.notifications.root, {
      params: { ...params },
    })
  },
  markRead(id) {
    return apiClient.post(API_ENDPOINTS.notifications.read(id))
  },
  markAllRead() {
    return apiClient.post(API_ENDPOINTS.notifications.readAll)
  },
}
