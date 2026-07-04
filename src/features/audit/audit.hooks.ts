'use client'

import { useQuery } from '@tanstack/react-query'
import { auditKeys } from './audit.keys'
import type { AuditListParams } from './audit.types'
import { auditService } from './index'

export function useAuditLogs(params?: AuditListParams) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditService.list(params),
  })
}
