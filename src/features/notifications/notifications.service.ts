import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
<<<<<<< HEAD
import type { NotificationsService } from './notifications.contract'

/** Real implementation backed by the REST API. */
export const realNotificationsService: NotificationsService = {
  list(params) {
    return apiClient.get(API_ENDPOINTS.notifications.root, {
      params: { ...params },
    })
  },
  markRead(id) {
    return apiClient.post(API_ENDPOINTS.notifications.read(id))
  },
  markAllRead() {
    return apiClient.post(API_ENDPOINTS.notifications.readAll)
=======
import type { PaginatedResponse } from '@/types/common'
import type { NotificationsService } from './notifications.contract'
import type {
  AppNotification,
  NotificationCategory,
  NotificationListParams,
} from './notifications.types'

/**
 * Real implementation backed by the REST API.
 *
 * The backend uses a different vocabulary than the frontend view-model: it
 * stores `readAt` (timestamp) rather than a `read` boolean and a broader `type`
 * enum, and the mark-read routes are PATCH (not POST). This adapter reconciles
 * the two so components stay unchanged.
 */

interface RawNotification {
  id: string
  userId: string
  type: string
  title: string
  body: string
  readAt: string | null
  createdAt: string
}

/** Backend NotificationType → frontend NotificationCategory. */
function toCategory(type: string): NotificationCategory {
  switch (type) {
    case 'assessment_reminder':
    case 'submission':
      return 'assessment'
    case 'coaching_reminder':
      return 'coaching'
    case 'achievement':
    case 'system':
    default:
      return 'system'
  }
}

/** Frontend NotificationCategory → backend NotificationType (for filtering). */
function toType(category: NotificationCategory): string | undefined {
  switch (category) {
    case 'assessment':
      return 'assessment_reminder'
    case 'coaching':
      return 'coaching_reminder'
    case 'system':
      return 'system'
    default:
      return undefined // 'goal' has no backend equivalent
  }
}

function toAppNotification(raw: RawNotification): AppNotification {
  return {
    id: raw.id,
    userId: raw.userId,
    category: toCategory(raw.type),
    title: raw.title,
    body: raw.body,
    read: raw.readAt != null,
    href: undefined, // backend has no deep-link column
    createdAt: raw.createdAt,
  }
}

export const realNotificationsService: NotificationsService = {
  async list(
    params?: NotificationListParams
  ): Promise<PaginatedResponse<AppNotification>> {
    const res = await apiClient.get<PaginatedResponse<RawNotification>>(
      API_ENDPOINTS.notifications.root,
      {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
          type: params?.category ? toType(params.category) : undefined,
          // Backend expects `unread`, not `read`.
          unread: params?.read === undefined ? undefined : !params.read,
        },
      }
    )
    return { data: res.data.map(toAppNotification), meta: res.meta }
  },

  async markRead(id: string): Promise<AppNotification> {
    const raw = await apiClient.patch<RawNotification>(
      API_ENDPOINTS.notifications.read(id)
    )
    return toAppNotification(raw)
  },

  async markAllRead(): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.notifications.readAll)
>>>>>>> origin/main
  },
}
