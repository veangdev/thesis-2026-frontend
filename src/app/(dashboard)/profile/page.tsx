import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ProfileCard } from '@/components/features/profile/profile-card'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <>
      <DashboardTopbar title="Profile" subtitle="Your account details" />
      <div className="p-4 sm:p-6">
        <ProfileCard />
      </div>
    </>
  )
}
