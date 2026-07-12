import Cookies from 'js-cookie'
import { ROLE_PERMISSIONS, type Permission, type Role } from '@/constants/roles'
import type { AuthTokens } from '@/types/auth'

/**
 * Token storage helpers.
 *
 * NOTE: This is the client-readable token layer used by the API client. When
 * the backend is ready, prefer httpOnly cookies set by the server for the
 * access/refresh tokens; this module is structured so it can be swapped without
 * touching callers.
 */
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens: AuthTokens): void {
  // Access token: short-lived (~15 min). Refresh token: 7 days.
  Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
    ...cookieOptions,
    expires: 1 / 96,
  })
  Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
    ...cookieOptions,
    expires: 7,
  })
}

export function clearTokens(): void {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}

/** Resolve the effective permissions for a role. */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return getRolePermissions(role).includes(permission)
}
