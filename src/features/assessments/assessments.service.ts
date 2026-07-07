import { API_ENDPOINTS } from '@/constants/api'
import { apiClient } from '@/services/api-client'
import type { PaginatedResponse } from '@/types/common'
import type { AssessmentsService } from './assessments.contract'
import type {
  Assessment,
  AssessmentListParams,
  MentorAssessmentPayload,
  SelfAssessmentPayload,
} from './assessments.types'

/**
 * Real implementation backed by the REST API. The backend carries a single
 * per-dimension `scores[]` array (self/mentor/agreed together) and nests
 * student/period relations; the frontend expects three flat score arrays plus
 * flattened scalars. This adapter reconciles responses and request payloads,
 * and uses PATCH (backend) instead of PUT for the save routes.
 */

interface RawScore {
  dimensionId: string
  selfScore: number | null
  selfReflection: string | null
  mentorScore: number | null
  mentorNote: string | null
  agreedScore: number | null
  coachingRecommended: boolean
}

interface RawAssessment {
  id: string
  studentId: string
  periodId: string
  status: Assessment['status']
  submittedAt: string | null
  mentorSubmittedAt: string | null
  createdAt: string
  updatedAt: string
  scores: RawScore[]
  period?: { cohortId: string; name: string } | null
  student?: { name: string } | null
}

function toAssessment(raw: RawAssessment): Assessment {
  return {
    id: raw.id,
    studentId: raw.studentId,
    studentName: raw.student?.name ?? '',
    cohortId: raw.period?.cohortId ?? '',
    periodId: raw.periodId,
    periodName: raw.period?.name ?? '',
    facilitatorId: undefined,
    status: raw.status,
    selfScores: raw.scores
      .filter((s) => s.selfScore != null)
      .map((s) => ({
        dimensionId: s.dimensionId,
        score: s.selfScore as number,
        reflection: s.selfReflection ?? undefined,
      })),
    mentorScores: raw.scores
      .filter((s) => s.mentorScore != null)
      .map((s) => ({
        dimensionId: s.dimensionId,
        score: s.mentorScore as number,
        note: s.mentorNote ?? undefined,
        coachingTag: s.coachingRecommended ? 'coaching_recommended' : undefined,
      })),
    agreedScores: raw.scores
      .filter((s) => s.agreedScore != null)
      .map((s) => ({
        dimensionId: s.dimensionId,
        score: s.agreedScore as number,
      })),
    overallReflection: undefined,
    overallFeedback: undefined,
    selfSubmittedAt: raw.submittedAt ?? undefined,
    completedAt: raw.mentorSubmittedAt ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export const realAssessmentsService: AssessmentsService = {
  async list(
    params?: AssessmentListParams
  ): Promise<PaginatedResponse<Assessment>> {
    // Backend rejects facilitatorId/cohortId params; role scoping is implicit.
    const res = await apiClient.get<PaginatedResponse<RawAssessment>>(
      API_ENDPOINTS.assessments.root,
      {
        params: {
          page: params?.page,
          // Backend caps pageSize at 100.
          pageSize: params?.pageSize
            ? Math.min(params.pageSize, 100)
            : undefined,
          studentId: params?.studentId,
          periodId: params?.periodId,
          status: params?.status,
        },
      }
    )
    return { data: res.data.map(toAssessment), meta: res.meta }
  },

  async getById(id: string): Promise<Assessment> {
    return toAssessment(
      await apiClient.get<RawAssessment>(API_ENDPOINTS.assessments.byId(id))
    )
  },

  async saveSelf(
    id: string,
    payload: SelfAssessmentPayload
  ): Promise<Assessment> {
    const body = {
      scores: payload.scores.map((s) => ({
        dimensionId: s.dimensionId,
        selfScore: s.score,
        selfReflection: s.reflection,
      })),
    }
    return toAssessment(
      await apiClient.patch<RawAssessment>(
        API_ENDPOINTS.assessments.self(id),
        body
      )
    )
  },

  async submitSelf(id: string): Promise<Assessment> {
    return toAssessment(
      await apiClient.post<RawAssessment>(
        API_ENDPOINTS.assessments.selfSubmit(id)
      )
    )
  },

  async saveMentor(
    id: string,
    payload: MentorAssessmentPayload
  ): Promise<Assessment> {
    const agreed = new Map(
      (payload.agreedScores ?? []).map((a) => [a.dimensionId, a.score])
    )
    // Backend wants one merged scores[] with mentor + agreed per dimension.
    const body = {
      scores: payload.scores.map((s) => ({
        dimensionId: s.dimensionId,
        mentorScore: s.score,
        mentorNote: s.note,
        agreedScore: agreed.get(s.dimensionId),
      })),
    }
    return toAssessment(
      await apiClient.patch<RawAssessment>(
        API_ENDPOINTS.assessments.mentor(id),
        body
      )
    )
  },

  async submitMentor(id: string): Promise<Assessment> {
    return toAssessment(
      await apiClient.post<RawAssessment>(
        API_ENDPOINTS.assessments.mentorSubmit(id)
      )
    )
  },
}
