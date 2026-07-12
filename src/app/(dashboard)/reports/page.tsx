import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { RoleSwitch } from '@/components/shared/role-switch'
import { CoordinatorReports } from '@/components/features/reports/coordinator-reports'
import { FacilitatorReports } from '@/components/features/reports/facilitator-reports'
import { StudentReports } from '@/components/features/reports/student-reports'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return (
    <>
      <DashboardTopbar
        title="Reports"
        subtitle="Trends, comparisons and history"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <RoleSwitch
          student={<StudentReports />}
          facilitator={<FacilitatorReports />}
          coordinator={<CoordinatorReports />}
        />
      </div>
    </>
  )
}
