'use client'

import Link from 'next/link'
<<<<<<< HEAD
import { ArrowRight, Star } from 'lucide-react'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
=======
import { ArrowRight, Star, UserPlus, Users, X } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
>>>>>>> origin/main
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
<<<<<<< HEAD
import { useCreateAssignment, useUsers, type User } from '@/features/users'
=======
import {
  useAssignments,
  useCreateAssignment,
  useDeleteAssignment,
  useFacilitatorStudents,
  useUser,
  useUsers,
  type User,
} from '@/features/users'
>>>>>>> origin/main
import { cn, formatDate } from '@/lib/utils'

interface UserProfileDrawerProps {
  user: User | null
  onOpenChange: (open: boolean) => void
}

<<<<<<< HEAD
/** Slide-over profile for the users table, with mentor assignment. */
=======
/** Slide-over profile for the users table. Students get a mentor picker;
 * facilitators/coordinators get their student roster with add/remove. */
>>>>>>> origin/main
export function UserProfileDrawer({
  user,
  onOpenChange,
}: UserProfileDrawerProps) {
  const cohorts = useCohorts()
<<<<<<< HEAD
  const facilitators = useUsers({ role: ROLES.FACILITATOR, pageSize: 50 })
  const assign = useCreateAssignment()

  const cohortName = (cohortId?: string) =>
    cohorts.data?.data.find((cohort) => cohort.id === cohortId)?.name ?? '—'
=======
  // Live copy: the table row snapshot goes stale after drawer-side mutations.
  const detail = useUser(user?.id)
  const current = detail.data ?? user

  const isMentorRole =
    current?.role === ROLES.FACILITATOR ||
    current?.role === ROLES.PROGRAM_COORDINATOR

  const allUsers = useUsers({ pageSize: 200 })
  const roster = useFacilitatorStudents(isMentorRole ? current?.id : undefined)
  const assignments = useAssignments()
  const assign = useCreateAssignment()
  const unassign = useDeleteAssignment()

  const everyone = allUsers.data?.data ?? []
  const cohortName = (cohortId?: string) =>
    cohorts.data?.data.find((cohort) => cohort.id === cohortId)?.name ?? '—'
  const userName = (id?: string) =>
    everyone.find((candidate) => candidate.id === id)?.name

  // Both facilitators and coordinators can mentor students.
  const mentorCandidates = everyone.filter(
    (candidate) => candidate.role !== ROLES.SELF_ASSESSOR
  )
  const studentCandidates = everyone.filter(
    (candidate) =>
      candidate.role === ROLES.SELF_ASSESSOR &&
      candidate.facilitatorId !== current?.id
  )

  function removeStudent(studentId: string) {
    const assignment = (assignments.data ?? []).find(
      (candidate) => candidate.studentId === studentId
    )
    if (assignment) unassign.mutate(assignment.id)
  }

  const addStudentSelect = current && (
    <Select
      value=""
      disabled={assign.isPending}
      onValueChange={(studentId) =>
        assign.mutate({ facilitatorId: current.id, studentId })
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Add a self-assessor…" />
      </SelectTrigger>
      <SelectContent>
        {studentCandidates.length === 0 ? (
          <p className="text-muted-foreground px-2 py-1.5 text-sm">
            No other self-assessors available
          </p>
        ) : (
          studentCandidates.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name}
              {student.facilitatorId
                ? ` — currently with ${userName(student.facilitatorId) ?? 'another mentor'}`
                : ''}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
>>>>>>> origin/main

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
<<<<<<< HEAD
        {user && (
=======
        {current && (
>>>>>>> origin/main
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <UserAvatar
<<<<<<< HEAD
                  name={user.name}
                  avatar={user.avatar}
                  className="size-12"
                />
                <div>
                  <SheetTitle className="font-heading">{user.name}</SheetTitle>
                  <SheetDescription>{user.email}</SheetDescription>
=======
                  name={current.name}
                  avatar={current.avatar}
                  className="size-12"
                />
                <div>
                  <SheetTitle className="font-heading">
                    {current.name}
                  </SheetTitle>
                  <SheetDescription>{current.email}</SheetDescription>
>>>>>>> origin/main
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
<<<<<<< HEAD
                  className={cn(ROLE_BADGE_CLASSES[user.role])}
                >
                  {ROLE_LABELS[user.role]}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  Joined {formatDate(user.createdAt)}
=======
                  className={cn(ROLE_BADGE_CLASSES[current.role])}
                >
                  {ROLE_LABELS[current.role]}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  Joined {formatDate(current.createdAt)}
>>>>>>> origin/main
                </span>
              </div>

              <Separator />

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs font-medium">
                    Cohort
                  </dt>
<<<<<<< HEAD
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
=======
                  <dd className="mt-0.5">{cohortName(current.cohortId)}</dd>
                </div>
                {current.role === ROLES.SELF_ASSESSOR && (
                  <div>
                    <dt className="text-muted-foreground text-xs font-medium">
                      Facilitator
                    </dt>
                    <dd className="mt-1.5">
                      <Select
                        value={current.facilitatorId ?? ''}
>>>>>>> origin/main
                        disabled={assign.isPending}
                        onValueChange={(facilitatorId) =>
                          assign.mutate({
                            facilitatorId,
<<<<<<< HEAD
                            studentId: user.id,
=======
                            studentId: current.id,
>>>>>>> origin/main
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
<<<<<<< HEAD
                          <SelectValue placeholder="Assign a mentor" />
                        </SelectTrigger>
                        <SelectContent>
                          {(facilitators.data?.data ?? []).map((mentor) => (
                            <SelectItem key={mentor.id} value={mentor.id}>
                              {mentor.name}
=======
                          <SelectValue placeholder="Assign a facilitator" />
                        </SelectTrigger>
                        <SelectContent>
                          {mentorCandidates.map((mentor) => (
                            <SelectItem key={mentor.id} value={mentor.id}>
                              {mentor.name} · {ROLE_LABELS[mentor.role]}
>>>>>>> origin/main
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </dd>
                  </div>
                )}
              </dl>

<<<<<<< HEAD
              {user.role === ROLES.SELF_ASSESSOR && (
                <>
                  <Separator />
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`${ROUTES.journeyStar}?studentId=${user.id}`}>
=======
              {isMentorRole && (
                <>
                  <Separator />
                  <section className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-medium">
                      <Users className="size-4" /> Self-assessors under{' '}
                      {current.name.split(' ')[0]}
                      <Badge variant="secondary">
                        {roster.data?.length ?? 0}
                      </Badge>
                    </h4>

                    {roster.isLoading ? (
                      <Skeleton className="h-16 w-full" />
                    ) : (roster.data ?? []).length === 0 ? (
                      <EmptyState
                        icon={UserPlus}
                        title="No self-assessors yet"
                        description={`Assign self-assessors so ${current.name} can review their assessments.`}
                        className="py-8"
                        action={<div className="w-60">{addStudentSelect}</div>}
                      />
                    ) : (
                      <>
                        <ul className="space-y-1.5">
                          {(roster.data ?? []).map((student) => (
                            <li
                              key={student.id}
                              className="flex items-center gap-2 rounded-lg border px-2 py-1.5"
                            >
                              <UserAvatar
                                name={student.name}
                                avatar={student.avatar}
                                className="size-7"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {student.name}
                                </p>
                                <p className="text-muted-foreground truncate text-xs">
                                  {cohortName(student.cohortId)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                disabled={unassign.isPending}
                                onClick={() => removeStudent(student.id)}
                                aria-label={`Remove ${student.name}`}
                              >
                                <X className="size-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        {addStudentSelect}
                      </>
                    )}
                  </section>
                </>
              )}

              {current.role === ROLES.SELF_ASSESSOR && (
                <>
                  <Separator />
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`${ROUTES.journeyStar}?studentId=${current.id}`}
                    >
>>>>>>> origin/main
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
