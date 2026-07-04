'use client'

import type { Assessment } from '@/features/assessments'
import type { Dimension } from '@/features/cohorts'
import { AssessmentSummary } from './assessment-summary'

interface MentorReviewWorkspaceProps {
  assessment: Assessment
  dimensions: Dimension[]
  scaleMax: number
}

/**
 * Placeholder until Phase 5: facilitators currently see the read-only
 * summary; the side-by-side review workspace replaces this next.
 */
export function MentorReviewWorkspace(props: MentorReviewWorkspaceProps) {
  return <AssessmentSummary {...props} />
}
