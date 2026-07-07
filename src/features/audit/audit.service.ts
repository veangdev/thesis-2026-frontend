import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { AuditService } from './audit.contract'
import type { AuditListParams, AuditLog } from './audit.types'

/**
 * Real implementation backed by the REST API. The backend returns `createdAt`
 * (not `timestamp`), a joined `actor` relation, and a JSON `metadata` blob;
 * this adapter maps those onto the frontend `AuditLog`. The backend only
 * accepts pagination params, so `search`/`entity` stay client-side.
 */

interface RawAuditLog {
  id: string
  actorId: string
  actor?: { id: string; name: string } | null
  action: string
  entity: string
  entityId?: string | null
  metadata?: unknown
  createdAt: string
}

function toAuditLog(raw: RawAuditLog): AuditLog {
  return {
    id: raw.id,
    actorId: raw.actorId,
    actorName: raw.actor?.name ?? raw.actorId,
    action: raw.action,
    entity: raw.entity,
    entityId: raw.entityId ?? undefined,
    details: raw.metadata != null ? JSON.stringify(raw.metadata) : undefined,
    timestamp: raw.createdAt,
  }
}

export const realAuditService: AuditService = {
  async list(params?: AuditListParams): Promise<PaginatedResponse<AuditLog>> {
    // Backend only accepts pagination; search/entity are applied client-side.
    const res = await apiClient.get<PaginatedResponse<RawAuditLog>>(
      API_ENDPOINTS.auditLogs.root,
      { params: { page: params?.page, pageSize: params?.pageSize } }
    )
    return { data: res.data.map(toAuditLog), meta: res.meta }
  },
}
