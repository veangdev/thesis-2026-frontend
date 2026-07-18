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

<<<<<<< HEAD
/** Resolve the signed-in mock user from the stored access token. */
export function currentMockUser(): User | null {
  const token = getAccessToken()
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null
  const userId = token.slice(TOKEN_PREFIX.length)
  return getDb().users.find((user) => user.id === userId) ?? null
=======
/** Find a seeded mock user by email (case-insensitive). */
export function mockUserByEmail(email: string): User | null {
  const target = email.trim().toLowerCase()
  return (
    getDb().users.find((user) => user.email.toLowerCase() === target) ?? null
  )
}

/**
 * Read the `email` claim from a real backend JWT without verifying it. Used only
 * to bridge a real session onto the matching seeded demo user in hybrid mode
 * (real-API auth + mock feature data); the backend remains the source of truth
 * for actually validating the token.
 */
function emailFromJwt(token: string): string | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    ) as { email?: unknown }
    return typeof payload.email === 'string' ? payload.email : null
  } catch {
    return null
  }
}

/**
 * Resolve the signed-in mock user from the stored access token.
 *
 * Two token shapes are supported:
 * - Pure mock tokens (`mock-access-<id>`) encode the mock user id directly.
 * - Real backend JWTs (hybrid mode) are bridged to the seeded demo user that
 *   shares the token's email, so mock-backed features stay coherent while auth
 *   runs against the real API.
 */
export function currentMockUser(): User | null {
  const token = getAccessToken()
  if (!token) return null
  if (token.startsWith(TOKEN_PREFIX)) {
    const userId = token.slice(TOKEN_PREFIX.length)
    return getDb().users.find((user) => user.id === userId) ?? null
  }
  const email = emailFromJwt(token)
  return email ? mockUserByEmail(email) : null
>>>>>>> origin/main
}
