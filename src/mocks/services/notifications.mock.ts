import { ApiError } from '@/services/api-client'
import type { NotificationsService } from '@/features/notifications/notifications.contract'
import { getDb } from '../db'
import { clone, delay, paginate } from '../latency'
import { currentMockUser } from '../session'

export const mockNotificationsService: NotificationsService = {
  async list(params) {
    await delay(180)
    const user = currentMockUser()
    if (!user) throw new ApiError('Unauthorized', 401)
    let rows = getDb().notifications.filter(
      (notification) => notification.userId === user.id
    )
    if (params?.category)
      rows = rows.filter((n) => n.category === params.category)
    if (params?.read !== undefined)
      rows = rows.filter((n) => n.read === params.read)
    rows = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return clone(paginate(rows, { page: 1, pageSize: 20, ...params }))
  },

  async markRead(id) {
    await delay(120)
    const notification = getDb().notifications.find(
      (candidate) => candidate.id === id
    )
    if (!notification) throw new ApiError('Notification not found', 404)
    notification.read = true
    return clone(notification)
  },

  async markAllRead() {
    await delay(150)
    const user = currentMockUser()
    if (!user) throw new ApiError('Unauthorized', 401)
    for (const notification of getDb().notifications) {
      if (notification.userId === user.id) notification.read = true
    }
  },
}
