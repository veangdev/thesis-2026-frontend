import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { JourneyStarView } from '@/components/features/journey-star/journey-star-view'

export const metadata: Metadata = { title: 'Journey Star' }

/** `searchParams` is a Promise in Next.js 16 — await it. */
export default async function JourneyStarPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>
}) {
  const { studentId } = await searchParams
  return (
    <>
      <DashboardTopbar
        title="Journey Star"
        subtitle="The whole journey on one star"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <JourneyStarView initialStudentId={studentId} />
      </div>
    </>
  )
}
