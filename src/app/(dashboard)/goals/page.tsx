import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Goals' }

export default function GoalsPage() {
  return (
    <>
      <DashboardTopbar
        title="Goals & Growth"
        subtitle="Track intentions and milestones per dimension"
      />
      <div className="p-4 sm:p-6">
        <ComingSoon
          title="Goals tracking is on the way"
          description="Create, track and review growth goals tied to each dimension once the backend is ready."
        />
      </div>
    </>
  )
}
