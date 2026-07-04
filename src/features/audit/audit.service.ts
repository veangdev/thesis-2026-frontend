import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { AuditService } from './audit.contract'

/** Real implementation backed by the REST API. */
export const realAuditService: AuditService = {
  list(params) {
    return apiClient.get(API_ENDPOINTS.auditLogs.root, {
      params: { ...params },
    })
  },
}
