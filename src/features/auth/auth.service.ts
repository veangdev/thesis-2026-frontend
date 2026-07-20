import { API_ENDPOINTS } from '@/constants/api'
import { clearTokens, getRefreshToken, setTokens } from '@/lib/auth'
import { mapApiUser, type ApiUser } from '@/lib/api-user'
import { apiClient } from '@/services/api-client'
import type {
  AuthTokens,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  User,
} from '@/types/auth'

import type { AuthService } from './auth.contract'

/**
 * Auth service — talks to the real backend.
 * These functions intentionally contain no mock/fake-auth shortcuts; mock
 * mode is provided by `src/mocks/services/auth.mock.ts`.
 */
export const realAuthService: AuthService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await apiClient.post<
      Omit<LoginResponse, 'user'> & { user: ApiUser }
    >(API_ENDPOINTS.auth.login, payload, { auth: false })
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
    return { ...res, user: mapApiUser(res.user) }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } finally {
      clearTokens()
    }
  },

  async me(signal?: AbortSignal): Promise<User> {
    return mapApiUser(
      await apiClient.get<ApiUser>(API_ENDPOINTS.auth.me, { signal })
    )
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.auth.changePassword, {
      currentPassword: payload.currentPassword,
      newPassword: payload.password,
    })
  },

  async refresh(): Promise<AuthTokens> {
    const refreshToken = getRefreshToken()
    const tokens = await apiClient.post<AuthTokens>(
      API_ENDPOINTS.auth.refresh,
      { refreshToken },
      { auth: false }
    )
    setTokens(tokens)
    return tokens
  },

  // The backend answers 204 (no body) to both of these, so we synthesise the
  // user-facing message here rather than reading it off the response.
  async forgotPassword(email: string): Promise<{ message: string }> {
    await apiClient.post(
      API_ENDPOINTS.auth.forgotPassword,
      { email },
      { auth: false }
    )
    return {
      message: 'If that account exists, we’ve emailed a 6-digit reset code.',
    }
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<{ message: string }> {
    await apiClient.post(
      API_ENDPOINTS.auth.resetPassword,
      {
        email: payload.email,
        otp: payload.otp,
        newPassword: payload.password,
      },
      { auth: false }
    )
    return { message: 'Password updated — you can sign in now.' }
  },
}
