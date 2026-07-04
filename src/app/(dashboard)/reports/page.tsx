import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'
import { RoleSwitch } from '@/components/shared/role-switch'
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
      <div className="p-4 sm:p-6">
        <RoleSwitch
          student={<StudentReports />}
          facilitator={<FacilitatorReports />}
          coordinator={
            <ComingSoon
              title="Program reports arrive shortly"
              description="Cohort radars, heatmaps, at-risk indicators, and exports land in an upcoming build step."
            />
          }
        />
      </div>
    </>
  )
}
