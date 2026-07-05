'use client'

import * as React from 'react'
import { ErrorState } from '@/components/shared/error-state'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { ROLES } from '@/constants/roles'
import { useAssessment } from '@/features/assessments'
import { useAuthStore } from '@/features/auth'
import { useCohort, useCohortDimensions } from '@/features/cohorts'
import { AssessmentSummary } from './assessment-summary'
import { SelfAssessmentWizard } from './self-assessment-wizard'
import { MentorReviewWorkspace } from './mentor-review-workspace'

/**
 * Assessment detail router: picks the right experience by role + status.
 * - self_assessor on a draft → the self-assessment wizard
 * - facilitator while the review is open → the mentor review workspace
 * - everything else → the read-only summary
 */
type DetailMode = 'wizard' | 'workspace' | 'summary'

export function AssessmentDetail({ assessmentId }: { assessmentId: string }) {
  const user = useAuthStore((state) => state.user)
  const assessment = useAssessment(assessmentId)
  const cohort = useCohort(assessment.data?.cohortId)
  const dimensions = useCohortDimensions(assessment.data?.cohortId)

  // Lock the experience chosen when the data first resolves: submitting from
  // the wizard flips the status (and refetches), but the success screen must
  // stay mounted rather than being swapped for the read-only summary.
  // (Conditional set-state-during-render is the sanctioned way to derive
  // state from async props exactly once.)
  const [mode, setMode] = React.useState<DetailMode | null>(null)
  if (mode === null && assessment.data && user) {
    const record = assessment.data
    if (user.role === ROLES.SELF_ASSESSOR && record.status === 'draft') {
      setMode('wizard')
    } else if (
      user.role === ROLES.FACILITATOR &&
      (record.status === 'self_submitted' ||
        record.status === 'mentor_review' ||
        record.status === 'agreed')
    ) {
      setMode('workspace')
    } else {
      setMode('summary')
    }
  }

  if (assessment.isError) {
    return (
      <ErrorState
        title="Assessment not found"
        description={assessment.error.message}
        onRetry={() => assessment.refetch()}
      />
    )
  }

  if (
    assessment.isLoading ||
    cohort.isLoading ||
    dimensions.isLoading ||
    !assessment.data ||
    !cohort.data ||
    !dimensions.data
  ) {
    return <PageSkeleton />
  }

  const scaleMax = cohort.data.scoringScaleMax
  const record = assessment.data

  if (mode === 'wizard') {
    return (
      <SelfAssessmentWizard
        assessment={record}
        dimensions={dimensions.data}
        scaleMax={scaleMax}
      />
    )
  }

  if (mode === 'workspace') {
    return (
      <MentorReviewWorkspace
        assessment={record}
        dimensions={dimensions.data}
        scaleMax={scaleMax}
      />
    )
  }

  return (
    <AssessmentSummary
      assessment={record}
      dimensions={dimensions.data}
      scaleMax={scaleMax}
    />
  )
}
