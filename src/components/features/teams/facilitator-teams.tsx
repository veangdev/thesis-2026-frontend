'use client'

import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES } from '@/constants/routes'
import { useAssessments } from '@/features/assessments'
import { useAuthStore } from '@/features/auth'
import { useCohorts } from '@/features/cohorts'
import { useFacilitatorStudents } from '@/features/users'

/** Facilitator roster: everyone assigned to me, with quick links. */
export function FacilitatorTeams() {
  const user = useAuthStore((state) => state.user)
  const roster = useFacilitatorStudents(user?.id)
  const cohorts = useCohorts()
  const assessments = useAssessments(
    user ? { facilitatorId: user.id, pageSize: 200 } : undefined
  )

  if (roster.isError) {
    return (
      <ErrorState
        description={roster.error.message}
        onRetry={() => roster.refetch()}
      />
    )
  }
  if (roster.isLoading) {
    return <Skeleton className="h-72 w-full" />
  }

  const students = roster.data ?? []
  if (students.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No students assigned yet"
        description="Your coordinator assigns students from the Teams board."
      />
    )
  }

  const cohortName = (cohortId?: string) =>
    cohorts.data?.data.find((cohort) => cohort.id === cohortId)?.name ?? '—'

  const completedCount = (studentId: string) =>
    (assessments.data?.data ?? []).filter(
      (assessment) =>
        assessment.studentId === studentId && assessment.status === 'completed'
    ).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">My roster</CardTitle>
        <CardDescription>
          {students.length} student{students.length > 1 ? 's' : ''} across your
          cohorts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Cohort</TableHead>
              <TableHead className="text-right">Completed cycles</TableHead>
              <TableHead className="text-right">Journey Star</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <UserAvatar
                      name={student.name}
                      avatar={student.avatar}
                      className="size-8"
                      fallbackClassName="text-xs"
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {cohortName(student.cohortId)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {completedCount(student.id)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`${ROUTES.journeyStar}?studentId=${student.id}`}
                    >
                      View <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
