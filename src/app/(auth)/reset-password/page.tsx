import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/features/auth/reset-password-form'

export const metadata: Metadata = { title: 'Reset password' }

/** `searchParams` is a Promise in Next.js 16 — await it server-side. */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return <ResetPasswordForm token={token ?? ''} />
}
