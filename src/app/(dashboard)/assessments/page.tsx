import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'
import { RoleSwitch } from '@/components/shared/role-switch'
import { StudentAssessmentsList } from '@/components/features/assessments/student-assessments-list'

export const metadata: Metadata = { title: 'Assessments' }

export default function AssessmentsPage() {
  return (
    <>
      <DashboardTopbar
        title="Assessments"
        subtitle="Self-assessments across your cycles"
      />
      <div className="p-4 sm:p-6">
        <RoleSwitch
          student={<StudentAssessmentsList />}
          facilitator={
            <ComingSoon
              title="Review queue arrives in the next build step"
              description="Submitted self-assessments will queue here for your review."
            />
          }
          coordinator={
            <ComingSoon
              title="Assessments overview arrives shortly"
              description="Period completion tracking and drill-downs land in an upcoming build step."
            />
          }
        />
      </div>
    </>
  )
}
