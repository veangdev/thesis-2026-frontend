'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { coachingKeys } from './coaching.keys'
import type {
  ActionItemPayload,
  CoachingListParams,
  CoachingSessionPayload,
} from './coaching.types'
import { coachingService } from './index'

export function useCoachingSessions(params?: CoachingListParams) {
  return useQuery({
    queryKey: coachingKeys.list(params),
    queryFn: () => coachingService.list(params),
  })
}

export function useCoachingSession(id: string | undefined) {
  return useQuery({
    queryKey: coachingKeys.detail(id ?? ''),
    queryFn: () => coachingService.getById(id as string),
    enabled: !!id,
  })
}

function useCoachingMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
  errorMessage: string,
  successMessage?: string
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachingKeys.all })
      if (successMessage) toast.success(successMessage)
    },
    onError: (error) => toast.error(error.message || errorMessage),
  })
}

export function useCreateCoachingSession() {
  return useCoachingMutation(
    (payload: CoachingSessionPayload) => coachingService.create(payload),
    'Failed to schedule the session',
    'Coaching session scheduled'
  )
}

export function useUpdateCoachingSession() {
  return useCoachingMutation(
    ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<CoachingSessionPayload>
    }) => coachingService.update(id, payload),
    'Failed to update the session'
  )
}

export function useDeleteCoachingSession() {
  return useCoachingMutation(
    (id: string) => coachingService.remove(id),
    'Failed to delete the session',
    'Coaching session removed'
  )
}

export function useCreateActionItem() {
  return useCoachingMutation(
    ({
      sessionId,
      payload,
    }: {
      sessionId: string
      payload: ActionItemPayload
    }) => coachingService.createActionItem(sessionId, payload),
    'Failed to add the action item'
  )
}

export function useUpdateActionItem() {
  return useCoachingMutation(
    ({ id, payload }: { id: string; payload: Partial<ActionItemPayload> }) =>
      coachingService.updateActionItem(id, payload),
    'Failed to update the action item'
  )
}

export function useDeleteActionItem() {
  return useCoachingMutation(
    (id: string) => coachingService.deleteActionItem(id),
    'Failed to delete the action item'
  )
}
