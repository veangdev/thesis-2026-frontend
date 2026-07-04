/** Notification domain models. */

export type NotificationCategory = 'assessment' | 'coaching' | 'goal' | 'system'

export const NOTIFICATION_CATEGORY_LABELS: Record<
  NotificationCategory,
  string
> = {
  assessment: 'Assessments',
  coaching: 'Coaching',
  goal: 'Goals',
  system: 'System',
}

export interface AppNotification {
  id: string
  userId: string
  category: NotificationCategory
  title: string
  body: string
  read: boolean
  /** In-app destination the notification links to. */
  href?: string
  createdAt: string
}

export interface NotificationListParams {
  page?: number
  pageSize?: number
  category?: NotificationCategory
  read?: boolean
}
