'use client'

import Link from 'next/link'
import { ArrowRight, Star, UserPlus, Users, X } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import {
  useAssignments,
  useCreateAssignment,
  useDeleteAssignment,
  useFacilitatorStudents,
  useUser,
  useUsers,
  type User,
} from '@/features/users'
import { cn, formatDate } from '@/lib/utils'

interface UserProfileDrawerProps {
  user: User | null
  onOpenChange: (open: boolean) => void
}

/** Slide-over profile for the users table. Students get a mentor picker;
 * facilitators/coordinators get their student roster with add/remove. */
export function UserProfileDrawer({
  user,
  onOpenChange,
}: UserProfileDrawerProps) {
  const cohorts = useCohorts()
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

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {current && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={current.name}
                  avatar={current.avatar}
                  className="size-12"
                />
                <div>
                  <SheetTitle className="font-heading">
                    {current.name}
                  </SheetTitle>
                  <SheetDescription>{current.email}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(ROLE_BADGE_CLASSES[current.role])}
                >
                  {ROLE_LABELS[current.role]}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  Joined {formatDate(current.createdAt)}
                </span>
              </div>

              <Separator />

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs font-medium">
                    Cohort
                  </dt>
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
                        disabled={assign.isPending}
                        onValueChange={(facilitatorId) =>
                          assign.mutate({
                            facilitatorId,
                            studentId: current.id,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Assign a facilitator" />
                        </SelectTrigger>
                        <SelectContent>
                          {mentorCandidates.map((mentor) => (
                            <SelectItem key={mentor.id} value={mentor.id}>
                              {mentor.name} · {ROLE_LABELS[mentor.role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </dd>
                  </div>
                )}
              </dl>

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
