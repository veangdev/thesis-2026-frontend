import { ApiError } from '@/services/api-client'
import type { AssessmentsService } from '@/features/assessments/assessments.contract'
import type {
  Assessment,
  AssessmentListParams,
} from '@/features/assessments/assessments.types'
import { getDb } from '../db'
import { clone, delay, paginate } from '../latency'

function applyFilters(
  rows: Assessment[],
  params?: AssessmentListParams
): Assessment[] {
  let filtered = rows
  if (params?.studentId)
    filtered = filtered.filter((a) => a.studentId === params.studentId)
  if (params?.facilitatorId)
    filtered = filtered.filter((a) => a.facilitatorId === params.facilitatorId)
  if (params?.cohortId)
    filtered = filtered.filter((a) => a.cohortId === params.cohortId)
  if (params?.periodId)
    filtered = filtered.filter((a) => a.periodId === params.periodId)
  if (params?.status)
    filtered = filtered.filter((a) => a.status === params.status)
  return filtered
}

function findAssessment(id: string): Assessment {
  const assessment = getDb().assessments.find(
    (candidate) => candidate.id === id
  )
  if (!assessment) throw new ApiError('Assessment not found', 404)
  return assessment
}

export const mockAssessmentsService: AssessmentsService = {
  async list(params) {
    await delay()
    const rows = applyFilters(getDb().assessments, params).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    )
    return clone(paginate(rows, { page: 1, pageSize: 20, ...params }))
  },

  async getById(id) {
    await delay(150)
    return clone(findAssessment(id))
  },

  async saveSelf(id, payload) {
    await delay()
    const assessment = findAssessment(id)
    if (assessment.status !== 'draft') {
      throw new ApiError('Self-assessment can only be edited as a draft', 409)
    }
    assessment.selfScores = payload.scores
    assessment.overallReflection = payload.overallReflection
    assessment.updatedAt = new Date().toISOString()
    return clone(assessment)
  },

  async submitSelf(id) {
    await delay()
    const assessment = findAssessment(id)
    if (assessment.status !== 'draft') {
      throw new ApiError('This assessment was already submitted', 409)
    }
    if (assessment.selfScores.length === 0) {
      throw new ApiError('Score every dimension before submitting', 422)
    }
    assessment.status = 'self_submitted'
    assessment.selfSubmittedAt = new Date().toISOString()
    assessment.updatedAt = assessment.selfSubmittedAt
    return clone(assessment)
  },

  async saveMentor(id, payload) {
    await delay()
    const assessment = findAssessment(id)
    if (assessment.status === 'draft' || assessment.status === 'completed') {
      throw new ApiError('This assessment is not open for mentor review', 409)
    }
    assessment.mentorScores = payload.scores
    if (payload.agreedScores) assessment.agreedScores = payload.agreedScores
    if (payload.overallFeedback !== undefined)
      assessment.overallFeedback = payload.overallFeedback
    if (assessment.status === 'self_submitted')
      assessment.status = 'mentor_review'
    if (payload.markAgreed && assessment.agreedScores.length > 0)
      assessment.status = 'agreed'
    assessment.updatedAt = new Date().toISOString()
    return clone(assessment)
  },

  async submitMentor(id) {
    await delay()
    const assessment = findAssessment(id)
    if (assessment.status !== 'agreed') {
      throw new ApiError(
        'Agree on final scores with the student before completing',
        409
      )
    }
    assessment.status = 'completed'
    assessment.completedAt = new Date().toISOString()
    assessment.updatedAt = assessment.completedAt
    return clone(assessment)
  },
}
