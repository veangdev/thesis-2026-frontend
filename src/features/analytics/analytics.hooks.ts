'use client'

import { useQuery } from '@tanstack/react-query'
import { analyticsKeys } from './analytics.keys'
import { analyticsService } from './index'

export function useStudentAnalytics(studentId: string | undefined) {
  return useQuery({
    queryKey: analyticsKeys.student(studentId ?? ''),
    queryFn: () => analyticsService.student(studentId as string),
    enabled: !!studentId,
  })
}

export function useCohortAnalytics(cohortId: string | undefined) {
  return useQuery({
    queryKey: analyticsKeys.cohort(cohortId ?? ''),
    queryFn: () => analyticsService.cohort(cohortId as string),
    enabled: !!cohortId,
  })
}

export function useOverviewAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: () => analyticsService.overview(),
  })
}

export function useGapAnalysis(assessmentId: string | undefined) {
  return useQuery({
    queryKey: analyticsKeys.gap(assessmentId ?? ''),
    queryFn: () => analyticsService.gap(assessmentId as string),
    enabled: !!assessmentId,
  })
}
