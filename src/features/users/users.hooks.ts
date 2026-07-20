'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userKeys } from './users.keys'
import { useAuthStore } from '@/features/auth/auth.store'
import type {
  AssignmentPayload,
  UpdateMePayload,
  UserListParams,
  UserPayload,
} from './users.types'
import { usersService } from './index'

export function useUsers(
  params?: UserListParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersService.list(params),
    // Listing users is staff-only on the backend; callers disable it for
    // students to avoid a guaranteed 403.
    enabled: options?.enabled ?? true,
  })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => usersService.getById(id as string),
    enabled: !!id,
  })
}

export function useFacilitatorStudents(facilitatorId: string | undefined) {
  return useQuery({
    queryKey: userKeys.facilitatorStudents(facilitatorId ?? ''),
    queryFn: () => usersService.facilitatorStudents(facilitatorId as string),
    enabled: !!facilitatorId,
  })
}

export function useAssignments(cohortId?: string) {
  return useQuery({
    queryKey: userKeys.assignments(cohortId),
    queryFn: () => usersService.listAssignments(cohortId),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UserPayload) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('User created')
    },
    onError: (error) => toast.error(error.message || 'Failed to create user'),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<UserPayload>
    }) => usersService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
    onError: (error) => toast.error(error.message || 'Failed to update user'),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('User removed')
    },
    onError: (error) => toast.error(error.message || 'Failed to remove user'),
  })
}

export function useBulkCreateUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payloads: UserPayload[]) => usersService.bulkCreate(payloads),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success(`${created.length} users imported`)
    },
    onError: (error) => toast.error(error.message || 'Bulk import failed'),
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AssignmentPayload) =>
      usersService.createAssignment(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
    onError: (error) =>
      toast.error(error.message || 'Failed to assign student'),
  })
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.deleteAssignment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
    onError: (error) =>
      toast.error(error.message || 'Failed to unassign student'),
  })
}

/** The facilitator assigned to the signed-in self-assessor (null if none). */
export function useMyFacilitator(enabled = true) {
  return useQuery({
    queryKey: userKeys.myFacilitator(),
    queryFn: () => usersService.myFacilitator(),
    enabled,
  })
}

/**
 * Self-service profile updates. Both refresh the auth store so the topbar,
 * sidebar and avatar reflect the change immediately.
 */
export function useUpdateMe() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  return useMutation({
    mutationFn: (payload: UpdateMePayload) => usersService.updateMe(payload),
    onSuccess: (user) => {
      setUser(user)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('Profile updated')
    },
    onError: (error) => toast.error(error.message || 'Could not save changes'),
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  return useMutation({
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: (user) => {
      setUser(user)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('Profile picture updated')
    },
    onError: (error) =>
      toast.error(error.message || 'Could not upload the image'),
  })
}
