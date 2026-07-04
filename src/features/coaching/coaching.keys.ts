import type { CoachingListParams } from './coaching.types'

export const coachingKeys = {
  all: ['coaching'] as const,
  lists: () => [...coachingKeys.all, 'list'] as const,
  list: (params?: CoachingListParams) =>
    [...coachingKeys.lists(), params ?? {}] as const,
  detail: (id: string) => [...coachingKeys.all, 'detail', id] as const,
}
