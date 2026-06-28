import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Journey Star' }

export default function JourneyStarPage() {
  return (
    <>
      <DashboardTopbar
        title="Journey Star"
        subtitle="Radar view of growth across the eight dimensions"
      />
      <div className="p-4 sm:p-6">
        <ComingSoon
          title="The Journey Star is on the way"
          description="A radar visualization of self vs. mentor scores per dimension will appear here once the API is connected."
        />
      </div>
    </>
  )
}
