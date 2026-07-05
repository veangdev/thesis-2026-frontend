'use client'

import Link from 'next/link'
import { ArrowRight, ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { useAssessments } from '@/features/assessments'
import { useAuthStore } from '@/features/auth'
import { formatDate } from '@/lib/utils'
import { AssessmentStatusBadge } from './assessment-status-badge'

/** Student view: all of my assessments across cycles, newest first. */
export function StudentAssessmentsList() {
  const user = useAuthStore((state) => state.user)
  const assessments = useAssessments(
    user ? { studentId: user.id, pageSize: 50 } : undefined
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
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  const rows = assessments.data?.data ?? []
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No assessments yet"
        description="Your first assessment appears when a cycle opens."
      />
    )
  }

  return (
    <div className="space-y-3">
      {rows.map((assessment) => (
        <Card key={assessment.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0 space-y-1">
              <p className="flex items-center gap-2 font-medium">
                {assessment.periodName}
                <AssessmentStatusBadge status={assessment.status} />
              </p>
              <p className="text-muted-foreground text-xs">
                {assessment.status === 'draft'
                  ? 'In progress — your reflection is waiting'
                  : assessment.completedAt
                    ? `Completed ${formatDate(assessment.completedAt)}`
                    : assessment.selfSubmittedAt
                      ? `Submitted ${formatDate(assessment.selfSubmittedAt)}`
                      : `Created ${formatDate(assessment.createdAt)}`}
              </p>
            </div>
            <Button
              variant={assessment.status === 'draft' ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <Link href={ROUTES.assessmentDetail(assessment.id)}>
                {assessment.status === 'draft' ? 'Continue' : 'View'}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
