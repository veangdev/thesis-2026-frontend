import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <>
      <DashboardTopbar
        title="Settings"
        subtitle="Manage your workspace and preferences"
      />
      <div className="p-4 sm:p-6">
        <ComingSoon
          title="Settings are on the way"
          description="Configure notifications, appearance and account settings once the backend is connected."
        />
      </div>
    </>
  )
}
