import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { RoleSwitch } from '@/components/shared/role-switch'
import { FacilitatorProfileExtras } from '@/components/features/profile/facilitator-profile-extras'
import { ProfileCard } from '@/components/features/profile/profile-card'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <>
      <DashboardTopbar title="Profile" subtitle="Your account details" />
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <ProfileCard />
        <RoleSwitch facilitator={<FacilitatorProfileExtras />} />
      </div>
    </>
  )
}
