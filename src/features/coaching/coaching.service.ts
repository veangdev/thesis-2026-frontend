import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { CoachingService } from './coaching.contract'

/** Real implementation backed by the REST API. */
export const realCoachingService: CoachingService = {
  list(params) {
    return apiClient.get(API_ENDPOINTS.coachingSessions.root, {
      params: { ...params },
    })
  },
  getById(id) {
    return apiClient.get(API_ENDPOINTS.coachingSessions.byId(id))
  },
  create(payload) {
    return apiClient.post(API_ENDPOINTS.coachingSessions.root, payload)
  },
  update(id, payload) {
    return apiClient.patch(API_ENDPOINTS.coachingSessions.byId(id), payload)
  },
  remove(id) {
    return apiClient.delete(API_ENDPOINTS.coachingSessions.byId(id))
  },

  createActionItem(sessionId, payload) {
    return apiClient.post(
      API_ENDPOINTS.coachingSessions.actionItems(sessionId),
      payload
    )
  },
  updateActionItem(id, payload) {
    return apiClient.patch(API_ENDPOINTS.actionItems.byId(id), payload)
  },
  deleteActionItem(id) {
    return apiClient.delete(API_ENDPOINTS.actionItems.byId(id))
  },
}
