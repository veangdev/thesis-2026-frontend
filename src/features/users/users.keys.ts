import type { UserListParams } from './users.types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserListParams) =>
    [...userKeys.lists(), params ?? {}] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  facilitatorStudents: (facilitatorId: string) =>
    [...userKeys.all, 'facilitator', facilitatorId, 'students'] as const,
  assignments: (cohortId?: string) =>
    [...userKeys.all, 'assignments', cohortId ?? 'all'] as const,
}
