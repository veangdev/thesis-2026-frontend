'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { goalKeys } from './goals.keys'
import type { GoalListParams, GoalPayload } from './goals.types'
import { goalsService } from './index'

export function useGoals(params?: GoalListParams) {
  return useQuery({
    queryKey: goalKeys.list(params),
    queryFn: () => goalsService.list(params),
  })
}

export function useGoal(id: string | undefined) {
  return useQuery({
    queryKey: goalKeys.detail(id ?? ''),
    queryFn: () => goalsService.getById(id as string),
    enabled: !!id,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: GoalPayload) => goalsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all })
      toast.success('Goal created — go get it! 🎯')
    },
    onError: (error) =>
      toast.error(error.message || 'Failed to create the goal'),
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<GoalPayload>
    }) => goalsService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalKeys.all }),
    onError: (error) =>
      toast.error(error.message || 'Failed to update the goal'),
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all })
      toast.success('Goal removed')
    },
    onError: (error) =>
      toast.error(error.message || 'Failed to remove the goal'),
  })
}
