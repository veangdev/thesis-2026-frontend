import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { RoleSwitch } from '@/components/shared/role-switch'
import { CoordinatorAssessmentsOverview } from '@/components/features/assessments/coordinator-assessments-overview'
import { FacilitatorReviewQueue } from '@/components/features/assessments/facilitator-review-queue'
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
          facilitator={<FacilitatorReviewQueue />}
          coordinator={<CoordinatorAssessmentsOverview />}
        />
      </div>
    </>
  )
}
