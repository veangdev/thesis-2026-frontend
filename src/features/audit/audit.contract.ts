import type { PaginatedResponse } from '@/types/common'
import type { AuditListParams, AuditLog } from './audit.types'

/** Shared interface implemented by the real and mock audit services. */
export interface AuditService {
  list(params?: AuditListParams): Promise<PaginatedResponse<AuditLog>>
}
