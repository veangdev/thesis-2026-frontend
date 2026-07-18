'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCheck } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
<<<<<<< HEAD
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
=======
import { TabPanels } from '@/components/shared/tab-panels'
>>>>>>> origin/main
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  NOTIFICATION_CATEGORY_LABELS,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  type NotificationCategory,
} from '@/features/notifications'
import { cn } from '@/lib/utils'

const CATEGORY_DOT: Record<NotificationCategory, string> = {
  assessment: 'bg-brand-navy dark:bg-chart-1',
  coaching: 'bg-brand-emerald',
  goal: 'bg-brand-gold',
  system: 'bg-muted-foreground',
}

/** Notifications center (spec §6): category tabs, unread filter, mark read. */
export function NotificationsCenter() {
  const router = useRouter()
  const [category, setCategory] = React.useState<NotificationCategory | 'all'>(
    'all'
  )
  const [unreadOnly, setUnreadOnly] = React.useState(false)

  const notifications = useNotifications({
    category: category === 'all' ? undefined : category,
    read: unreadOnly ? false : undefined,
    pageSize: 50,
  })
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  if (notifications.isError) {
    return (
      <ErrorState
        description={notifications.error.message}
        onRetry={() => notifications.refetch()}
      />
    )
  }

  const rows = notifications.data?.data ?? []
  const unreadCount = rows.filter((notification) => !notification.read).length

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
<<<<<<< HEAD
        <Tabs
=======
        <TabPanels
>>>>>>> origin/main
          value={category}
          onValueChange={(value) =>
            setCategory(value as NotificationCategory | 'all')
          }
<<<<<<< HEAD
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {(
=======
          tabs={[
            { value: 'all', label: 'All' },
            ...(
>>>>>>> origin/main
              Object.entries(NOTIFICATION_CATEGORY_LABELS) as [
                NotificationCategory,
                string,
              ][]
<<<<<<< HEAD
            ).map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
=======
            ).map(([value, label]) => ({ value, label })),
          ]}
        />
>>>>>>> origin/main

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="unread-only"
              checked={unreadOnly}
              onCheckedChange={setUnreadOnly}
            />
            <Label htmlFor="unread-only" className="text-sm font-normal">
              Unread only
            </Label>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="size-4" /> Mark all read
            </Button>
          )}
        </div>
      </div>

      {notifications.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up"
          description={
            unreadOnly
              ? 'No unread notifications — nice.'
              : 'Notifications land here as things happen.'
          }
        />
      ) : (
        <div className="space-y-2">
          {rows.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                'cursor-pointer transition-colors',
                !notification.read && 'border-primary/30 bg-primary/[0.03]'
              )}
              onClick={() => {
                if (!notification.read) markRead.mutate(notification.id)
                if (notification.href) router.push(notification.href)
              }}
            >
              <CardContent className="flex items-start gap-3 py-4">
                <span
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    CATEGORY_DOT[notification.category]
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm',
                      !notification.read && 'font-semibold'
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {notification.body}
                  </p>
                  <p className="text-muted-foreground/70 mt-1 text-xs">
                    {NOTIFICATION_CATEGORY_LABELS[notification.category]} ·{' '}
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
