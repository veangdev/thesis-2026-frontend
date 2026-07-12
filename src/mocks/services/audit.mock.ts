import type { AuditService } from '@/features/audit/audit.contract'
import { getDb } from '../db'
import { clone, delay, paginate } from '../latency'

export const mockAuditService: AuditService = {
  async list(params) {
    await delay()
    let rows = getDb().auditLogs
    if (params?.entity)
      rows = rows.filter((log) => log.entity === params.entity)
    if (params?.search) {
      const query = params.search.toLowerCase()
      rows = rows.filter(
        (log) =>
          log.actorName.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          (log.details ?? '').toLowerCase().includes(query)
      )
    }
    rows = [...rows].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    return clone(paginate(rows, { page: 1, pageSize: 20, ...params }))
  },
}
