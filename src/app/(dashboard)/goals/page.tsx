import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { GoalsView } from '@/components/features/goals/goals-view'

export const metadata: Metadata = { title: 'Goals' }

export default function GoalsPage() {
  return (
    <>
      <DashboardTopbar
        title="Goals & Growth"
        subtitle="Intentions and milestones per dimension"
      />
      <div className="p-4 sm:p-6">
        <GoalsView />
      </div>
    </>
  )
}
