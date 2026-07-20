'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useChangePassword } from '@/features/auth/auth.hooks'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    password: z.string().min(8, 'Use at least 8 characters'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })
  .refine((values) => values.password !== values.currentPassword, {
    message: 'Choose a password different from your current one',
    path: ['password'],
  })

const EMPTY = { currentPassword: '', password: '', confirm: '' }

/**
 * Password field with the toggle inside it, right-aligned — the convention
 * users already know from GitHub, Google and Stripe. Each field owns its own
 * visibility so revealing one doesn't expose the others over your shoulder.
 */
function PasswordInput({
  autoComplete,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = React.useState(false)
  const Icon = visible ? EyeOff : Eye
  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        className="pr-10"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        // Not a tab stop: keyboard users move label → field → next field
        // without a detour, and the toggle is still reachable by pointer.
        tabIndex={-1}
        className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 grid w-10 place-items-center transition-colors"
      >
        <Icon className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export function ChangePasswordCard() {
  const changePassword = useChangePassword()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  })

  const fields = [
    {
      name: 'currentPassword',
      label: 'Current password',
      ac: 'current-password',
    },
    { name: 'password', label: 'New password', ac: 'new-password' },
    { name: 'confirm', label: 'Confirm new password', ac: 'new-password' },
  ] as const

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">Password</CardTitle>
        <CardDescription>
          Use at least 8 characters. You stay signed in after changing it.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            changePassword.mutate(
              {
                currentPassword: values.currentPassword,
                password: values.password,
              },
              { onSuccess: () => form.reset(EMPTY) }
            )
          )}
          noValidate
          // Card spaces its own direct children with `gap-6`, but this form
          // sits between them, so it has to reproduce that gap itself —
          // otherwise the last field butts against the footer's divider.
          className="flex flex-col gap-6"
        >
          <CardContent className="space-y-4">
            {fields.map((f) => (
              <FormField
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <PasswordInput autoComplete={f.ac} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Update password
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
