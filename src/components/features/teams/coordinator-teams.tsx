'use client'

import * as React from 'react'
import { Loader2, UserPlus, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { ErrorState } from '@/components/shared/error-state'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ROLES } from '@/constants/roles'
import { useCreateAssignment, useUsers, type User } from '@/features/users'

/** Soft cap used for the capacity meters. */
const CAPACITY = 8

/**
 * Coordinator assignment board (spec §6): facilitator columns with capacity
 * indicators, an unassigned pool, per-student reassignment, and auto-assign.
 * Assignment is click/select-based — reliable on every input device.
 */
export function CoordinatorTeams() {
  const students = useUsers({ role: ROLES.SELF_ASSESSOR, pageSize: 100 })
  const facilitators = useUsers({ role: ROLES.FACILITATOR, pageSize: 50 })
  const assign = useCreateAssignment()
  const [autoAssigning, setAutoAssigning] = React.useState(false)

  if (students.isError) {
    return (
      <ErrorState
        description={students.error.message}
        onRetry={() => students.refetch()}
      />
    )
  }
  if (students.isLoading || facilitators.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const allStudents = students.data?.data ?? []
  const mentors = facilitators.data?.data ?? []
  const unassigned = allStudents.filter((student) => !student.facilitatorId)
  const rosterOf = (facilitatorId: string) =>
    allStudents.filter((student) => student.facilitatorId === facilitatorId)

  async function autoAssign() {
    setAutoAssigning(true)
    try {
      // Round-robin the unassigned pool onto the lightest-loaded mentors.
      const loads = new Map(
        mentors.map((mentor) => [mentor.id, rosterOf(mentor.id).length])
      )
      for (const student of unassigned) {
        const lightest = [...loads.entries()].sort((a, b) => a[1] - b[1])[0]
        if (!lightest) break

        await assign.mutateAsync({
          facilitatorId: lightest[0],
          studentId: student.id,
        })
        loads.set(lightest[0], lightest[1] + 1)
      }
      toast.success('Self-assessors distributed across facilitators')
    } catch {
      // Hook already toasts individual failures.
    } finally {
      setAutoAssigning(false)
    }
  }

  function StudentChip({ student }: { student: User }) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar
            name={student.name}
            avatar={student.avatar}
            className="size-7"
            fallbackClassName="text-[10px]"
          />
          <span className="truncate text-sm">{student.name}</span>
        </div>
        <Select
          value={student.facilitatorId ?? ''}
          disabled={assign.isPending || autoAssigning}
          onValueChange={(facilitatorId) =>
            assign.mutate({ facilitatorId, studentId: student.id })
          }
        >
          <SelectTrigger
            size="sm"
            className="w-32 shrink-0"
            aria-label={`Facilitator for ${student.name}`}
          >
            <SelectValue placeholder="Assign…" />
          </SelectTrigger>
          <SelectContent>
            {mentors.map((mentor) => (
              <SelectItem key={mentor.id} value={mentor.id}>
                {mentor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {unassigned.length > 0 && (
        <Card className="border-brand-gold/40">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-heading flex items-center gap-2 text-base">
                <UserPlus className="text-brand-gold size-4" /> Unassigned
                self-assessors ({unassigned.length})
              </CardTitle>
              <CardDescription>
                Pick a mentor per student, or distribute automatically.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={autoAssign}
              disabled={autoAssigning || assign.isPending}
            >
              {autoAssigning ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Auto-assign
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {unassigned.map((student) => (
              <StudentChip key={student.id} student={student} />
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mentors.map((mentor) => {
          const roster = rosterOf(mentor.id)
          const loadPercent = Math.min(
            100,
            Math.round((roster.length / CAPACITY) * 100)
          )
          return (
            <Card key={mentor.id}>
              <CardHeader className="pb-3">
                <CardTitle className="font-heading flex items-center gap-2 text-base">
                  <UserAvatar
                    name={mentor.name}
                    avatar={mentor.avatar}
                    className="size-7"
                    fallbackClassName="text-[10px]"
                  />
                  {mentor.name}
                </CardTitle>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Capacity</span>
                    <span className="font-mono tabular-nums">
                      {roster.length}/{CAPACITY}
                    </span>
                  </div>
                  <Progress
                    value={loadPercent}
                    aria-label={`${mentor.name} capacity`}
                    className={
                      loadPercent >= 90
                        ? '[&>[data-slot=progress-indicator]]:bg-destructive'
                        : loadPercent >= 65
                          ? '[&>[data-slot=progress-indicator]]:bg-brand-gold'
                          : ''
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {roster.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No students yet.
                  </p>
                ) : (
                  roster.map((student) => (
                    <StudentChip key={student.id} student={student} />
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
