'use client'

import Link from 'next/link'
import { ArrowRight, ClipboardCheck } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TabPanels } from '@/components/shared/tab-panels'
import { ROUTES } from '@/constants/routes'
import type { Assessment } from '@/features/assessments'
import { useAssessments } from '@/features/assessments'
import { useAuthStore } from '@/features/auth'
import { formatDate } from '@/lib/utils'
import { AssessmentStatusBadge } from './assessment-status-badge'

function AssessmentRow({ assessment }: { assessment: Assessment }) {
  const actionable =
    assessment.status === 'self_submitted' ||
    assessment.status === 'mentor_review' ||
    assessment.status === 'agreed'
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="min-w-0 space-y-1">
          <p className="flex flex-wrap items-center gap-2 font-medium">
            {assessment.studentName}
            <AssessmentStatusBadge status={assessment.status} />
          </p>
          <p className="text-muted-foreground text-xs">
            {assessment.periodName}
            {assessment.selfSubmittedAt &&
              ` · submitted ${formatDate(assessment.selfSubmittedAt)}`}
          </p>
        </div>
        <Button variant={actionable ? 'default' : 'outline'} size="sm" asChild>
          <Link href={ROUTES.assessmentDetail(assessment.id)}>
            {actionable ? 'Review' : 'View'} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

/** Facilitator view of /assessments: review queue + full roster history. */
export function FacilitatorReviewQueue() {
  const user = useAuthStore((state) => state.user)
  const assessments = useAssessments(
    user ? { facilitatorId: user.id, pageSize: 200 } : undefined
  )

  if (assessments.isError) {
    return (
      <ErrorState
        description={assessments.error.message}
        onRetry={() => assessments.refetch()}
      />
    )
  }
  if (assessments.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  const rows = assessments.data?.data ?? []
  const queue = rows.filter(
    (assessment) =>
      assessment.status === 'self_submitted' ||
      assessment.status === 'mentor_review' ||
      assessment.status === 'agreed'
  )

  return (
    <TabPanels
      tabs={[
        {
          value: 'queue',
          label: `Needs attention${queue.length > 0 ? ` (${queue.length})` : ''}`,
          contentClassName: 'space-y-3',
          content:
            queue.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title="Nothing needs your attention"
                description="Submitted self-assessments appear here for review."
              />
            ) : (
              queue.map((assessment) => (
                <AssessmentRow key={assessment.id} assessment={assessment} />
              ))
            ),
        },
        {
          value: 'all',
          label: 'All assessments',
          contentClassName: 'space-y-3',
          content: rows.map((assessment) => (
            <AssessmentRow key={assessment.id} assessment={assessment} />
          )),
        },
      ]}
    />
  )
}
