/** Audit-log domain models (coordinator settings tab). */

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  action: string
  entity: string
  entityId?: string
  details?: string
  timestamp: string
}

export interface AuditListParams {
  page?: number
  pageSize?: number
  search?: string
  entity?: string
}
