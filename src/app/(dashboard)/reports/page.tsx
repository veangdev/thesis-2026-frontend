import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return (
    <>
      <DashboardTopbar
        title="Reports"
        subtitle="Analytics, gap analysis and exports"
      />
      <div className="p-4 sm:p-6">
        <ComingSoon
          title="Reports are on the way"
          description="Batch analytics, gap analysis and exportable reports will appear here once the API is connected."
        />
      </div>
    </>
  )
}
