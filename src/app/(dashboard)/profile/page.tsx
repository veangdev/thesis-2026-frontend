import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ProfileScreen } from '@/components/features/profile/profile-screen'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <>
      <DashboardTopbar
        title="Profile"
        subtitle="Your account, picture and password"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <ProfileScreen />
      </div>
    </>
  )
}
