import { env } from '@/config/env'
import type { Role, User } from '@/types/auth'

/** The user shape the API returns (avatar is `avatarUrl`, cohort is flattened). */
export interface ApiUser {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string | null
  cohortId?: string | null
  cohortName?: string | null
  expertiseTags?: string[]
  availability?: string[]
  createdAt: string
}

/**
 * Uploaded avatars are stored as a server-relative path (`/uploads/avatars/…`)
 * so the value stays portable across environments. Resolve it against the API
 * origin — the API lives on a different port to the app in development.
 */
export function resolveAvatarUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  if (/^(https?:|data:|blob:)/i.test(url)) return url
  const origin = new URL(env.apiBaseUrl).origin
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Single place the API user shape becomes the app's `User`. */
export function mapApiUser(raw: ApiUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatar: resolveAvatarUrl(raw.avatarUrl),
    cohortId: raw.cohortId ?? undefined,
    cohortName: raw.cohortName ?? undefined,
    expertiseTags: raw.expertiseTags ?? [],
    availability: raw.availability ?? [],
    createdAt: raw.createdAt,
  }
}
