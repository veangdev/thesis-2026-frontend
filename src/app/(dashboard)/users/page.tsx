import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { EmptyState } from '@/components/shared/empty-state'
import { UserManagement } from '@/components/features/users/user-management'
import { ROLES } from '@/constants/roles'
import { RequireRole } from '@/features/auth'

export const metadata: Metadata = { title: 'Users' }

export default function UsersPage() {
  return (
    <>
      <DashboardTopbar
        title="User Management"
        subtitle="Students, facilitators, and coordinators"
      />
      <div className="p-4 sm:p-6">
        <RequireRole
          allow={ROLES.PROGRAM_COORDINATOR}
          fallback={
            <EmptyState
              title="Coordinators only"
              description="User management is restricted to program coordinators."
            />
          }
        >
          <UserManagement />
        </RequireRole>
      </div>
    </>
  )
}
