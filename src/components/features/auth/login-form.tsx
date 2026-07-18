'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Star } from 'lucide-react'
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
import { env } from '@/config/env'
import { ROUTES } from '@/constants/routes'
import { useLogin } from '@/features/auth/auth.hooks'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

type LoginValues = z.infer<typeof loginSchema>

const DEMO_ACCOUNTS = [
  { label: 'Coordinator', email: 'coordinator@pnc.edu' },
  { label: 'Facilitator', email: 'facilitator@pnc.edu' },
<<<<<<< HEAD
  { label: 'Student', email: 'student@pnc.edu' },
=======
  { label: 'Self-Assessor', email: 'student@pnc.edu' },
>>>>>>> origin/main
]

export function LoginForm() {
  const searchParams = useSearchParams()
  const expired = searchParams.get('expired') === '1'
  const login = useLogin()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function fillDemo(email: string) {
    form.setValue('email', email)
    form.setValue('password', 'Password123!')
    form.clearErrors()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="bg-primary text-primary-foreground mb-4 flex size-10 items-center justify-center rounded-xl lg:hidden">
          <Star className="size-5" />
        </div>
        <h1 className="font-heading text-2xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to continue your growth journey.
        </p>
      </div>

      {expired && (
        <p
          role="status"
          className="bg-brand-gold/10 text-brand-gold rounded-xl px-4 py-3 text-sm"
        >
          Your session expired — please sign in again.
        </p>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => login.mutate(values))}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href={ROUTES.forgotPassword}
                    className="text-primary text-xs hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Loader2 className="size-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </Form>

<<<<<<< HEAD
      {env.useMocks && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs">
            Demo mode — tap an account to fill the form
=======
      {!env.isProduction && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs">
            Quick sign-in — tap a seeded demo account
>>>>>>> origin/main
          </p>
          <div className="flex justify-center gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemo(account.email)}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
