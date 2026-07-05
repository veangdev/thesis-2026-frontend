import { API_ENDPOINTS } from '@/constants/api'
import { clearTokens, getRefreshToken, setTokens } from '@/lib/auth'
import { apiClient } from '@/services/api-client'
import type {
  AuthTokens,
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
    const res = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      payload,
      { auth: false }
    )
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
    return res
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } finally {
      clearTokens()
    }
  },

  me(signal?: AbortSignal): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.auth.me, { signal })
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

  forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post(
      API_ENDPOINTS.auth.forgotPassword,
      { email },
      { auth: false }
    )
  },

  resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    return apiClient.post(API_ENDPOINTS.auth.resetPassword, payload, {
      auth: false,
    })
  },
}
