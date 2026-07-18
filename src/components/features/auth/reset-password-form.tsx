'use client'

<<<<<<< HEAD
import Link from 'next/link'
=======
>>>>>>> origin/main
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
<<<<<<< HEAD
import { ROUTES } from '@/constants/routes'
=======
>>>>>>> origin/main
import { useResetPassword } from '@/features/auth/auth.hooks'

const schema = z
  .object({
<<<<<<< HEAD
=======
    email: z.string().email('Enter a valid email address'),
    otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
>>>>>>> origin/main
    password: z.string().min(8, 'Use at least 8 characters'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

<<<<<<< HEAD
export function ResetPasswordForm({ token }: { token: string }) {
  const resetPassword = useResetPassword()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  })

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-heading text-2xl font-semibold">
          Invalid reset link
        </h1>
        <p className="text-muted-foreground text-sm">
          This link is missing its token. Request a new one and try again.
        </p>
        <Button asChild>
          <Link href={ROUTES.forgotPassword}>Request a new link</Link>
        </Button>
      </div>
    )
  }

=======
export function ResetPasswordForm({ email }: { email: string }) {
  const resetPassword = useResetPassword()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email, otp: '', password: '', confirm: '' },
  })

>>>>>>> origin/main
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold">
          Choose a new password
        </h1>
        <p className="text-muted-foreground text-sm">
<<<<<<< HEAD
          Make it strong — at least 8 characters.
=======
          Enter the 6-digit code we emailed you, then pick a new password.
>>>>>>> origin/main
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
<<<<<<< HEAD
            resetPassword.mutate({ token, password: values.password })
=======
            resetPassword.mutate({
              email: values.email,
              otp: values.otp,
              password: values.password,
            })
>>>>>>> origin/main
          )}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
<<<<<<< HEAD
=======
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@pnc.edu"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset code</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    className="tracking-[0.5em]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
>>>>>>> origin/main
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Reset password
          </Button>
        </form>
      </Form>
    </div>
  )
}
