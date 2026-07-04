import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { NotificationsCenter } from '@/components/features/notifications/notifications-center'

export const metadata: Metadata = { title: 'Notifications' }

export default function NotificationsPage() {
  return (
    <>
      <DashboardTopbar
        title="Notifications"
        subtitle="Everything that needs your attention"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <NotificationsCenter />
      </div>
    </>
  )
}
