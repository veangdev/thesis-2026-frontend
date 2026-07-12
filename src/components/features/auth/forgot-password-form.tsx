'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
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
import { ROUTES } from '@/constants/routes'
import { useForgotPassword } from '@/features/auth/auth.hooks'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  if (forgotPassword.isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-brand-emerald/10 text-brand-emerald mx-auto flex size-14 items-center justify-center rounded-full">
          <MailCheck className="size-7" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold">
            Check your inbox
          </h1>
          <p className="text-muted-foreground text-sm">
            {forgotPassword.data.message}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={ROUTES.login}>
            <ArrowLeft className="size-4" /> Back to sign in
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            forgotPassword.mutate(values.email)
          )}
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
          <Button
            type="submit"
            className="w-full"
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Send reset link
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-center text-sm">
        Remembered it?{' '}
        <Link href={ROUTES.login} className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
