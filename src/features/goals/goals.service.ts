import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { GoalsService } from './goals.contract'

/** Real implementation backed by the REST API. */
export const realGoalsService: GoalsService = {
  list(params) {
    return apiClient.get(API_ENDPOINTS.goals.root, { params: { ...params } })
  },
  getById(id) {
    return apiClient.get(API_ENDPOINTS.goals.byId(id))
  },
  create(payload) {
    return apiClient.post(API_ENDPOINTS.goals.root, payload)
  },
  update(id, payload) {
    return apiClient.patch(API_ENDPOINTS.goals.byId(id), payload)
  },
  remove(id) {
    return apiClient.delete(API_ENDPOINTS.goals.byId(id))
  },
}
