import type {
  AuthTokens,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  User,
} from '@/types/auth'

/** Shared interface implemented by the real and mock auth services. */
export interface AuthService {
  login(payload: LoginPayload): Promise<LoginResponse>
  logout(): Promise<void>
  me(signal?: AbortSignal): Promise<User>
  refresh(): Promise<AuthTokens>
  forgotPassword(email: string): Promise<{ message: string }>
  resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }>
  changePassword(payload: ChangePasswordPayload): Promise<void>
}
