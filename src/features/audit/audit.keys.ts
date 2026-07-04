import type { AuditListParams } from './audit.types'

export const auditKeys = {
  all: ['audit'] as const,
  list: (params?: AuditListParams) =>
    [...auditKeys.all, 'list', params ?? {}] as const,
}
