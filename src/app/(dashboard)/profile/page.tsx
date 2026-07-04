import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <>
      <DashboardTopbar
        title="Profile"
        subtitle="Your account details and preferences"
      />
      <div className="p-4 sm:p-6">
        <ComingSoon
          title="Profile is on the way"
          description="View and edit your personal details, avatar and role once the backend is connected."
        />
      </div>
    </>
  )
}
