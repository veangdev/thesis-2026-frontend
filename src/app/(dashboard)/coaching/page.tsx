import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { CoachingView } from '@/components/features/coaching/coaching-view'

export const metadata: Metadata = { title: 'Coaching' }

export default function CoachingPage() {
  return (
    <>
      <DashboardTopbar
        title="Coaching Sessions"
        subtitle="Sessions, action items, and follow-ups"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <CoachingView />
      </div>
    </>
  )
}
