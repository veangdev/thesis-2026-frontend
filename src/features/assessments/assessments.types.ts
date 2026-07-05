/** Assessment domain models. Status machine (spec §3):
 *  draft → self_submitted → mentor_review → agreed → completed
 */

export type AssessmentStatus =
  | 'draft'
  | 'self_submitted'
  | 'mentor_review'
  | 'agreed'
  | 'completed'

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, string> = {
  draft: 'Draft',
  self_submitted: 'Self-Submitted',
  mentor_review: 'Mentor Review',
  agreed: 'Agreed',
  completed: 'Completed',
}

/** Coaching tags a mentor can attach to a dimension during review. */
export type CoachingTag =
  | 'needs_focus'
  | 'on_track'
  | 'strength'
  | 'coaching_recommended'

export const COACHING_TAG_LABELS: Record<CoachingTag, string> = {
  needs_focus: 'Needs Focus',
  on_track: 'On Track',
  strength: 'Strength',
  coaching_recommended: 'Coaching Recommended',
}

export interface SelfScore {
  dimensionId: string
  score: number
  reflection?: string
}

export interface MentorScore {
  dimensionId: string
  score: number
  note?: string
  coachingTag?: CoachingTag
}

export interface AgreedScore {
  dimensionId: string
  score: number
}

export interface Assessment {
  id: string
  studentId: string
  studentName: string
  cohortId: string
  periodId: string
  periodName: string
  facilitatorId?: string
  status: AssessmentStatus
  selfScores: SelfScore[]
  mentorScores: MentorScore[]
  agreedScores: AgreedScore[]
  overallReflection?: string
  overallFeedback?: string
  selfSubmittedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface AssessmentListParams {
  page?: number
  pageSize?: number
  studentId?: string
  facilitatorId?: string
  cohortId?: string
  periodId?: string
  status?: AssessmentStatus
}

export interface SelfAssessmentPayload {
  scores: SelfScore[]
  overallReflection?: string
}

export interface MentorAssessmentPayload {
  scores: MentorScore[]
  agreedScores?: AgreedScore[]
  overallFeedback?: string
  /** Advances mentor_review → agreed when the discussion concludes. */
  markAgreed?: boolean
}
