import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { AssessmentDetail } from '@/components/features/assessments/assessment-detail'

export const metadata: Metadata = { title: 'Assessment' }

/** `params` is a Promise in Next.js 16 — await it. */
export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <DashboardTopbar title="Assessment" subtitle="Score, reflect, and grow" />
      <div className="p-4 sm:p-6">
        <AssessmentDetail assessmentId={id} />
      </div>
    </>
  )
}
