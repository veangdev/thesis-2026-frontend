import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Coaching' }

export default function CoachingPage() {
  return (
    <>
      <DashboardTopbar
        title="Coaching Sessions"
        subtitle="Plan 1-on-1 and group sessions with action items"
      />
      <div className="p-4 sm:p-6">
        <ComingSoon
          title="Coaching sessions are on the way"
          description="Schedule sessions, capture notes and assign action items once the backend is connected."
        />
      </div>
    </>
  )
}
