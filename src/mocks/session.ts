import { getAccessToken } from '@/lib/auth'
import type { User } from '@/types/auth'
import { getDb } from './db'

const TOKEN_PREFIX = 'mock-access-'

export function accessTokenFor(userId: string): string {
  return `${TOKEN_PREFIX}${userId}`
}

export function refreshTokenFor(userId: string): string {
  return `mock-refresh-${userId}`
}

export function userIdFromRefreshToken(token: string): string | null {
  return token.startsWith('mock-refresh-')
    ? token.slice('mock-refresh-'.length)
    : null
}

/** Resolve the signed-in mock user from the stored access token. */
export function currentMockUser(): User | null {
  const token = getAccessToken()
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null
  const userId = token.slice(TOKEN_PREFIX.length)
  return getDb().users.find((user) => user.id === userId) ?? null
}
