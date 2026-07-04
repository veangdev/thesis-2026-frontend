import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'
import { RoleSwitch } from '@/components/shared/role-switch'
import { StudentDashboard } from '@/components/features/dashboard/student-dashboard'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <>
      <DashboardTopbar title="Dashboard" subtitle="Your growth at a glance" />
      <div className="p-4 sm:p-6">
        <RoleSwitch
          student={<StudentDashboard />}
          facilitator={
            <ComingSoon
              title="Facilitator dashboard arrives in the next build step"
              description="Your student roster, pending reviews, and coaching schedule are on the way."
            />
          }
          coordinator={
            <ComingSoon
              title="Coordinator dashboard arrives shortly"
              description="Program KPIs, cohort heatmaps, and mentor workload land in an upcoming build step."
            />
          }
        />
      </div>
    </>
  )
}
