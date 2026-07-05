'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cohortKeys } from './cohorts.keys'
import type {
  CohortListParams,
  CohortUpdatePayload,
  DimensionPayload,
  PeriodPayload,
} from './cohorts.types'
import { cohortsService } from './index'

export function useCohorts(params?: CohortListParams) {
  return useQuery({
    queryKey: cohortKeys.list(params),
    queryFn: () => cohortsService.list(params),
  })
}

export function useCohort(id: string | undefined) {
  return useQuery({
    queryKey: cohortKeys.detail(id ?? ''),
    queryFn: () => cohortsService.getById(id as string),
    enabled: !!id,
  })
}

export function useCohortDimensions(cohortId: string | undefined) {
  return useQuery({
    queryKey: cohortKeys.dimensions(cohortId ?? ''),
    queryFn: () => cohortsService.listDimensions(cohortId as string),
    enabled: !!cohortId,
  })
}

export function useCohortPeriods(cohortId: string | undefined) {
  return useQuery({
    queryKey: cohortKeys.periods(cohortId ?? ''),
    queryFn: () => cohortsService.listPeriods(cohortId as string),
    enabled: !!cohortId,
  })
}

export function useUpdateCohort() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: CohortUpdatePayload
    }) => cohortsService.update(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cohortKeys.all }),
    onError: (error) => toast.error(error.message || 'Failed to update cohort'),
  })
}

export function useCreateDimension() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      cohortId,
      payload,
    }: {
      cohortId: string
      payload: DimensionPayload
    }) => cohortsService.createDimension(cohortId, payload),
    onSuccess: (_data, { cohortId }) =>
      queryClient.invalidateQueries({
        queryKey: cohortKeys.dimensions(cohortId),
      }),
    onError: (error) =>
      toast.error(error.message || 'Failed to create dimension'),
  })
}

export function useUpdateDimension(cohortId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<DimensionPayload>
    }) => cohortsService.updateDimension(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: cohortKeys.dimensions(cohortId),
      }),
    onError: (error) =>
      toast.error(error.message || 'Failed to update dimension'),
  })
}

export function useDeleteDimension(cohortId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cohortsService.deleteDimension(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: cohortKeys.dimensions(cohortId),
      }),
    onError: (error) =>
      toast.error(error.message || 'Failed to delete dimension'),
  })
}

export function useCreatePeriod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      cohortId,
      payload,
    }: {
      cohortId: string
      payload: PeriodPayload
    }) => cohortsService.createPeriod(cohortId, payload),
    onSuccess: (_data, { cohortId }) =>
      queryClient.invalidateQueries({ queryKey: cohortKeys.periods(cohortId) }),
    onError: (error) => toast.error(error.message || 'Failed to create period'),
  })
}

export function useUpdatePeriod(cohortId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<PeriodPayload>
    }) => cohortsService.updatePeriod(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cohortKeys.periods(cohortId) }),
    onError: (error) => toast.error(error.message || 'Failed to update period'),
  })
}

export function useDeletePeriod(cohortId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cohortsService.deletePeriod(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cohortKeys.periods(cohortId) }),
    onError: (error) => toast.error(error.message || 'Failed to delete period'),
  })
}
