import type { GoalListParams } from './goals.types'

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (params?: GoalListParams) =>
    [...goalKeys.lists(), params ?? {}] as const,
  detail: (id: string) => [...goalKeys.all, 'detail', id] as const,
}
