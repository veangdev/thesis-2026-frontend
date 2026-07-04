import { mockAuditService } from '@/mocks/services/audit.mock'
import { pickService } from '@/services/service-factory'
import { realAuditService } from './audit.service'

export const auditService = pickService(realAuditService, mockAuditService)

export * from './audit.types'
export type { AuditService } from './audit.contract'
export { auditKeys } from './audit.keys'
export * from './audit.hooks'
