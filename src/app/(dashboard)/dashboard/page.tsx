import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { RoleSwitch } from '@/components/shared/role-switch'
import { CoordinatorDashboard } from '@/components/features/dashboard/coordinator-dashboard'
import { FacilitatorDashboard } from '@/components/features/dashboard/facilitator-dashboard'
import { StudentDashboard } from '@/components/features/dashboard/student-dashboard'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <>
      <DashboardTopbar title="Dashboard" subtitle="Your growth at a glance" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <RoleSwitch
          student={<StudentDashboard />}
          facilitator={<FacilitatorDashboard />}
          coordinator={<CoordinatorDashboard />}
        />
      </div>
    </>
  )
}
