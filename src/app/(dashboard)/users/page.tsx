import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Users' }

export default function UsersPage() {
  return (
    <>
      <DashboardTopbar
        title="User Management"
        subtitle="Manage students, mentors and managers"
      />
      <div className="p-4 sm:p-6">
        <ComingSoon
          title="User management is on the way"
          description="Invite, edit and manage users and roles here once the backend is ready."
        />
      </div>
    </>
  )
}
