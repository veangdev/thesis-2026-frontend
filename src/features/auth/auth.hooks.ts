'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { getPostLoginRoute } from './auth.constants'
import { useAuthStore } from './auth.store'
import { authService } from './index'
import type {
  ChangePasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
} from '@/types/auth'

/**
 * Login mutation: authenticates, stores the user, and redirects to the
 * role-aware landing route (honouring ?next= deep links from the proxy).
 */
export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ user }) => {
      setUser(user)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      const next = searchParams.get('next')
      router.replace(
        next && next.startsWith('/') ? next : getPostLoginRoute(user.role)
      )
    },
    onError: (error) => {
      toast.error(error.message || 'Sign-in failed. Check your credentials.')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (result) => toast.success(result.message),
    onError: (error) =>
      toast.error(error.message || 'Could not send the reset link'),
  })
}

export function useResetPassword() {
  const router = useRouter()
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
    onSuccess: (result) => {
      toast.success(result.message)
      router.replace('/login')
    },
    onError: (error) =>
      toast.error(error.message || 'Could not reset the password'),
  })
}

/** Change the signed-in user's password (requires the current one). */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
    onSuccess: () => toast.success('Password updated'),
    onError: (error) =>
      toast.error(error.message || 'Could not change the password'),
  })
}
