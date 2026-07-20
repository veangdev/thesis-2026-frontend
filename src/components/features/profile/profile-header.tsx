'use client'

import * as React from 'react'
import {
  CalendarDays,
  Camera,
  GraduationCap,
  Loader2,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ROLE_BADGE_CLASSES, ROLE_LABELS, ROLES } from '@/constants/roles'
import { useMyFacilitator, useUploadAvatar } from '@/features/users'
import { cn, formatDate } from '@/lib/utils'
import type { User } from '@/types/auth'

/** Mirrors the limits the backend enforces, so we fail fast and explain why. */
const MAX_BYTES = 2 * 1024 * 1024
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp']

/**
 * Identity card: profile picture (with upload), name, role, email, and the
 * read-only account facts. Those facts are a single line of context each, so
 * they ride along here rather than in a card of their own.
 */
export function ProfileHeader({ user }: { user: User }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const uploadAvatar = useUploadAvatar()
  const isSelfAssessor = user.role === ROLES.SELF_ASSESSOR
  const facilitator = useMyFacilitator(isSelfAssessor)

  const facts = [
    {
      icon: CalendarDays,
      label: 'Member since',
      value: formatDate(user.createdAt),
    },
    ...(user.cohortName
      ? [{ icon: Users, label: 'Cohort', value: user.cohortName }]
      : []),
    ...(isSelfAssessor
      ? [
          {
            icon: GraduationCap,
            label: 'Facilitator',
            value: facilitator.isPending
              ? '…'
              : (facilitator.data?.name ?? 'Not assigned yet'),
          },
        ]
      : []),
  ]

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset immediately so re-picking the same file still fires onChange.
    event.target.value = ''
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Choose a PNG, JPEG or WebP image')
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error('That image is larger than 2 MB')
      return
    }
    uploadAvatar.mutate(file)
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="relative">
          <UserAvatar
            name={user.name}
            avatar={user.avatar}
            className="size-24"
            // Initials sit at ~38% of the circle everywhere else in the app;
            // text-2xl on a 96px avatar reads as an empty disc.
            fallbackClassName="text-4xl"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadAvatar.isPending}
            aria-label="Change profile picture"
            className="bg-primary text-primary-foreground ring-background hover:bg-primary/90 focus-visible:ring-ring absolute right-0 bottom-0 grid size-8 place-items-center rounded-full ring-2 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-70"
          >
            {uploadAvatar.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            onChange={onPick}
            className="sr-only"
            tabIndex={-1}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading truncate text-xl font-semibold">
              {user.name}
            </h2>
            <Badge
              variant="secondary"
              className={cn(ROLE_BADGE_CLASSES[user.role])}
            >
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
          <p className="text-muted-foreground truncate text-sm">{user.email}</p>
          <p className="text-muted-foreground text-xs">
            PNG, JPEG or WebP · up to 2 MB
          </p>
        </div>
      </CardContent>

      {/* Read-only account facts. Each is one line, so they read better as a
          strip under the identity than as a card in their own column. */}
      <CardFooter className="flex flex-wrap gap-x-8 gap-y-4 border-t pt-6">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="bg-muted text-muted-foreground grid size-8 shrink-0 place-items-center rounded-md">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-medium">
                {label}
              </p>
              <p className="truncate text-sm">{value}</p>
            </div>
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}
