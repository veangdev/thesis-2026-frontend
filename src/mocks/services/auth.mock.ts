import { clearTokens, getRefreshToken, setTokens } from '@/lib/auth'
import { ApiError } from '@/services/api-client'
import type {
  AuthTokens,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  User,
} from '@/types/auth'
import type { AuthService } from '@/features/auth/auth.contract'
import { getDb } from '../db'
import { delay } from '../latency'
import { DEMO_PASSWORD } from '../seed/users.seed'
import {
  accessTokenFor,
  currentMockUser,
  refreshTokenFor,
  userIdFromRefreshToken,
} from '../session'

/**
 * Mock auth: accepts any seeded user email with the demo password and issues
 * fake tokens that encode the user id, so guards, the proxy cookie check, and
 * `me()` hydration behave exactly like real mode.
 */
export const mockAuthService: AuthService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    await delay()
    const user = getDb().users.find(
      (candidate) =>
        candidate.email.toLowerCase() === payload.email.trim().toLowerCase()
    )
    if (!user || payload.password !== DEMO_PASSWORD) {
      throw new ApiError('Invalid email or password', 401)
    }
    const tokens = {
      accessToken: accessTokenFor(user.id),
      refreshToken: refreshTokenFor(user.id),
    }
    setTokens(tokens)
    return { user, ...tokens }
  },

  async logout(): Promise<void> {
    await delay(150)
    clearTokens()
  },

  async me(): Promise<User> {
    await delay(150)
    const user = currentMockUser()
    if (!user) throw new ApiError('Unauthorized', 401)
    return user
  },

  async refresh(): Promise<AuthTokens> {
    await delay(150)
    const refreshToken = getRefreshToken()
    const userId = refreshToken ? userIdFromRefreshToken(refreshToken) : null
    if (!userId) throw new ApiError('Invalid refresh token', 401)
    const tokens = {
      accessToken: accessTokenFor(userId),
      refreshToken: refreshTokenFor(userId),
    }
    setTokens(tokens)
    return tokens
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    void email // Accepted but unused — mock never sends mail.
    await delay()
    return {
      message:
        'If that account exists, a reset link is on its way to your inbox.',
    }
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<{ message: string }> {
    void payload // Accepted but unused — mock never persists passwords.
    await delay()
    return { message: 'Password updated — you can sign in now.' }
  },
}
