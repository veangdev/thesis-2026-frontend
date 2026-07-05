'use client'

import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ROLE_BADGE_CLASSES, ROLE_LABELS, ROLES } from '@/constants/roles'
import { useAuthStore } from '@/features/auth'
import { useCohort } from '@/features/cohorts'
import { useUser } from '@/features/users'
import { cn, formatDate } from '@/lib/utils'

/** All-role profile: identity, role, cohort, and mentor details. */
export function ProfileCard() {
  const user = useAuthStore((state) => state.user)
  const cohort = useCohort(user?.cohortId)
  const facilitator = useUser(
    user?.role === ROLES.SELF_ASSESSOR ? user?.facilitatorId : undefined
  )

  if (!user) return <Skeleton className="h-64 w-full" />

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <UserAvatar
            name={user.name}
            avatar={user.avatar}
            className="size-16"
            fallbackClassName="text-lg"
          />
          <div className="space-y-1">
            <CardTitle className="font-heading text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge
              variant="secondary"
              className={cn('w-fit', ROLE_BADGE_CLASSES[user.role])}
            >
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs font-medium">
                Member since
              </dt>
              <dd className="mt-0.5">{formatDate(user.createdAt)}</dd>
            </div>
            {user.cohortId && (
              <div>
                <dt className="text-muted-foreground text-xs font-medium">
                  Cohort
                </dt>
                <dd className="mt-0.5">
                  {cohort.data?.name ?? '…'}
                  {cohort.data && (
                    <span className="text-muted-foreground">
                      {' '}
                      · {cohort.data.scoringScaleMax}-point scale
                    </span>
                  )}
                </dd>
              </div>
            )}
            {user.role === ROLES.SELF_ASSESSOR && user.facilitatorId && (
              <div>
                <dt className="text-muted-foreground text-xs font-medium">
                  Mentor
                </dt>
                <dd className="mt-0.5">{facilitator.data?.name ?? '…'}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
