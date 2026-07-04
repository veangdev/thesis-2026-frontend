'use client'

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ROLE_BADGE_CLASSES, ROLE_LABELS, ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useCohorts } from '@/features/cohorts'
import { useCreateAssignment, useUsers, type User } from '@/features/users'
import { cn, formatDate, getInitials } from '@/lib/utils'

interface UserProfileDrawerProps {
  user: User | null
  onOpenChange: (open: boolean) => void
}

/** Slide-over profile for the users table, with mentor assignment. */
export function UserProfileDrawer({
  user,
  onOpenChange,
}: UserProfileDrawerProps) {
  const cohorts = useCohorts()
  const facilitators = useUsers({ role: ROLES.FACILITATOR, pageSize: 50 })
  const assign = useCreateAssignment()

  const cohortName = (cohortId?: string) =>
    cohorts.data?.data.find((cohort) => cohort.id === cohortId)?.name ?? '—'

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {user && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className="font-heading">{user.name}</SheetTitle>
                  <SheetDescription>{user.email}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(ROLE_BADGE_CLASSES[user.role])}
                >
                  {ROLE_LABELS[user.role]}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>

              <Separator />

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs font-medium">
                    Cohort
                  </dt>
                  <dd className="mt-0.5">{cohortName(user.cohortId)}</dd>
                </div>
                {user.role === ROLES.SELF_ASSESSOR && (
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">
                      Mentor
                    </dt>
                    <dd className="mt-1.5">
                      <Select
                        value={user.facilitatorId ?? ''}
                        disabled={assign.isPending}
                        onValueChange={(facilitatorId) =>
                          assign.mutate({
                            facilitatorId,
                            studentId: user.id,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Assign a mentor" />
                        </SelectTrigger>
                        <SelectContent>
                          {(facilitators.data?.data ?? []).map((mentor) => (
                            <SelectItem key={mentor.id} value={mentor.id}>
                              {mentor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </dd>
                  </div>
                )}
              </dl>

              {user.role === ROLES.SELF_ASSESSOR && (
                <>
                  <Separator />
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`${ROUTES.journeyStar}?studentId=${user.id}`}>
                      <Star className="size-4" /> View Journey Star{' '}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
