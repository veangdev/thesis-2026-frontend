'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/features/notifications'
import { cn } from '@/lib/utils'

/** Topbar bell: unread badge, latest notifications, mark-read actions. */
export function NotificationsMenu() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const notificationsQuery = useNotifications(
    { pageSize: 8 },
    { enabled: isAuthenticated }
  )
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = notificationsQuery.data?.data ?? []
  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isAuthenticated) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notifications (${unreadCount} unread)`
              : 'Notifications'
          }
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute top-1 right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="size-3.5" /> Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notificationsQuery.isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-muted-foreground px-4 py-8 text-center text-sm">
              You&apos;re all caught up ✨
            </p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  if (!notification.read) markRead.mutate(notification.id)
                  if (notification.href) router.push(notification.href)
                }}
                className={cn(
                  'hover:bg-accent/60 block w-full border-b px-4 py-3 text-left last:border-b-0',
                  !notification.read && 'bg-primary/5'
                )}
              >
                <span className="flex items-start gap-2">
                  {!notification.read && (
                    <span className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {notification.title}
                    </span>
                    <span className="text-muted-foreground line-clamp-2 block text-xs">
                      {notification.body}
                    </span>
                    <span className="text-muted-foreground/70 mt-1 block text-[11px]">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </span>
                </span>
              </button>
            ))
          )}
        </div>

        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href={ROUTES.notifications}>View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
