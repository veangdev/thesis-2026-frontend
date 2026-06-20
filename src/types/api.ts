/** Domain models returned by the backend API. */

export type AssessmentStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATED' | 'COMPLETED'
export type ScoreTag = 'NEEDS_FOCUS' | 'ON_TRACK' | 'STRENGTH'

export interface Dimension {
  id: string
  name: string
  description: string
  order: number
}

export interface AssessmentScore {
  dimensionId: string
  dimensionName: string
  selfScore: number | null
  mentorScore: number | null
  finalScore: number | null
  gap: number | null
  selfReflection?: string
  mentorFeedback?: string
  tag?: ScoreTag
}

export interface Assessment {
  id: string
  studentId: string
  mentorId: string
  cycleId: string
  cycleName: string
  status: AssessmentStatus
  scores: AssessmentScore[]
  overallFeedback?: string
  submittedAt?: string
  evaluatedAt?: string
  createdAt: string
}

export interface Cycle {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'UPCOMING' | 'OPEN' | 'CLOSED'
}

export interface GapData {
  dimensionId: string
  dimensionName: string
  selfScore: number
  mentorScore: number
  gap: number
  previousGap: number
  trend: 'IMPROVING' | 'WORSENING' | 'STABLE'
}

export interface BatchStats {
  batchId: string
  batchName: string
  studentCount: number
  mentorCount: number
  avgScore: number
  completionRate: number
}
