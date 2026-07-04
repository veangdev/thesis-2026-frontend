import type { Metadata } from 'next'
import { DashboardTopbar } from '@/components/layouts/dashboard-topbar'
import { GapAnalysisView } from '@/components/features/assessments/gap-analysis-view'

export const metadata: Metadata = { title: 'Gap analysis' }

/** `params` is a Promise in Next.js 16 — await it. */
export default async function GapAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <DashboardTopbar
        title="Gap Analysis"
        subtitle="Where self-perception meets mentor perspective"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <GapAnalysisView assessmentId={id} />
      </div>
    </>
  )
}
