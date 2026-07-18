'use client'

import * as React from 'react'
import Link from 'next/link'
<<<<<<< HEAD
import { ArrowRight, Search } from 'lucide-react'
import { ErrorState } from '@/components/shared/error-state'
import { Badge } from '@/components/ui/badge'
=======
import { ArrowRight } from 'lucide-react'
import { ErrorState } from '@/components/shared/error-state'
>>>>>>> origin/main
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
<<<<<<< HEAD
import { Input } from '@/components/ui/input'
=======
import { Progress } from '@/components/ui/progress'
>>>>>>> origin/main
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
<<<<<<< HEAD
import { STUDENT_CLASSES, STUDENT_CLASS_LABELS } from '@/constants/classes'
import type { StudentClass } from '@/constants/classes'
import { GENDER_BADGE_CLASSES, GENDER_LABELS, GENDERS } from '@/constants/genders'
import type { Gender } from '@/constants/genders'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAssessments } from '@/features/assessments'
import { useCohortPeriods, useCohorts } from '@/features/cohorts'
import { useUsers } from '@/features/users'
import { AssessmentStatusBadge } from './assessment-status-badge'

/**
 * Coordinator /assessments: a full student roster for the selected Batch
 * (cohort) — searchable by name/email, filterable by Period, Gender and
 * Class. Defaults to the batch's current (active) period, e.g. "Cycle 4 —
 * Mastery", so each student shows the one period they're actually in;
 * switching the Period dropdown re-scopes every row to that period instead.
 */
=======
import { ROUTES } from '@/constants/routes'
import { useAssessments } from '@/features/assessments'
import { useCohortPeriods, useCohorts } from '@/features/cohorts'
import { formatDate } from '@/lib/utils'
import { AssessmentStatusBadge } from './assessment-status-badge'

/** Coordinator /assessments: per-period completion tracking + drill-down. */
>>>>>>> origin/main
export function CoordinatorAssessmentsOverview() {
  const cohorts = useCohorts()
  const [cohortId, setCohortId] = React.useState<string | undefined>()
  const activeCohortId = cohortId ?? cohorts.data?.data[0]?.id
  const periods = useCohortPeriods(activeCohortId)
  const assessments = useAssessments(
    activeCohortId ? { cohortId: activeCohortId, pageSize: 500 } : undefined
  )
<<<<<<< HEAD

  const [periodFilter, setPeriodFilter] = React.useState<string>('')
  const [genderFilter, setGenderFilter] = React.useState<Gender | 'all'>(
    'all'
  )
  const [classFilter, setClassFilter] = React.useState<StudentClass | 'all'>(
    'all'
  )
  const [search, setSearch] = React.useState('')

  const roster = useUsers(
    activeCohortId
      ? {
          cohortId: activeCohortId,
          role: ROLES.SELF_ASSESSOR,
          gender: genderFilter === 'all' ? undefined : genderFilter,
          studentClass: classFilter === 'all' ? undefined : classFilter,
          search: search.trim() || undefined,
          pageSize: 500,
        }
      : undefined
  )
=======
  const [drillPeriodId, setDrillPeriodId] = React.useState<string | null>(null)
>>>>>>> origin/main

  if (assessments.isError) {
    return (
      <ErrorState
        description={assessments.error.message}
        onRetry={() => assessments.refetch()}
      />
    )
  }

  const rows = assessments.data?.data ?? []
<<<<<<< HEAD

  const assessmentForStudent = (studentId: string, periodId: string) =>
    rows.find((a) => a.studentId === studentId && a.periodId === periodId)

  const students = roster.data?.data ?? []
  const periodList = periods.data ?? []

  // Default to the batch's current (active) period — e.g. "Cycle 4 —
  // Mastery" — so each student's row shows the one period they're actually
  // in right now, not every period at once. Falls back to the most recent
  // period if none is active. A manual pick from the dropdown overrides it.
  const defaultPeriodId =
    periodList.find((p) => p.status === 'active')?.id ??
    periodList[periodList.length - 1]?.id
  const effectivePeriodId = periodList.some((p) => p.id === periodFilter)
    ? periodFilter
    : (defaultPeriodId ?? '')

  /** One row per student, for whichever period is selected (defaults to the
   *  batch's current/active period). */
  const groupedRows = students.map((student) => ({
    student,
    period: periodList.find((p) => p.id === effectivePeriodId),
    assessment: assessmentForStudent(student.id, effectivePeriodId),
  }))
=======
  const byPeriod = (periodId: string) =>
    rows.filter((assessment) => assessment.periodId === periodId)

  const drillRows = drillPeriodId ? byPeriod(drillPeriodId) : []
  const drillPeriod = (periods.data ?? []).find(
    (period) => period.id === drillPeriodId
  )
>>>>>>> origin/main

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={activeCohortId ?? ''}
          onValueChange={(value) => {
            setCohortId(value)
<<<<<<< HEAD
            setPeriodFilter('')
          }}
        >
          <SelectTrigger size="sm" className="w-72">
            <SelectValue placeholder="Pick a batch" />
=======
            setDrillPeriodId(null)
          }}
        >
          <SelectTrigger size="sm" className="w-72">
            <SelectValue placeholder="Pick a cohort" />
>>>>>>> origin/main
          </SelectTrigger>
          <SelectContent>
            {(cohorts.data?.data ?? []).map((cohort) => (
              <SelectItem key={cohort.id} value={cohort.id}>
                {cohort.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
<<<<<<< HEAD
            Students in this batch
          </CardTitle>
          <CardDescription>
            Every student in the selected batch, with their assessment status.
          </CardDescription>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="relative w-56">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or email…"
                className="h-8 pl-8"
              />
            </div>

            <Select
              value={effectivePeriodId}
              onValueChange={(value) => setPeriodFilter(value)}
            >
              <SelectTrigger
                size="sm"
                className="w-48"
                aria-label="Filter by period"
              >
                <SelectValue placeholder="Pick a period" />
              </SelectTrigger>
              <SelectContent>
                {(periods.data ?? []).map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={genderFilter}
              onValueChange={(value) =>
                setGenderFilter(value as Gender | 'all')
              }
            >
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                {(Object.values(GENDERS) as Gender[]).map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {GENDER_LABELS[gender]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={classFilter}
              onValueChange={(value) =>
                setClassFilter(value as StudentClass | 'all')
              }
            >
              <SelectTrigger size="sm" className="w-36">
                <SelectValue placeholder="All classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All classes</SelectItem>
                {STUDENT_CLASSES.map((studentClass) => (
                  <SelectItem key={studentClass} value={studentClass}>
                    {STUDENT_CLASS_LABELS[studentClass]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {roster.isLoading || assessments.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : groupedRows.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No students match these filters in this batch.
            </p>
=======
            Periods & completion
          </CardTitle>
          <CardDescription>
            Completed reviews out of expected assessments, per cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {periods.isLoading || assessments.isLoading ? (
            <Skeleton className="h-48 w-full" />
>>>>>>> origin/main
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
<<<<<<< HEAD
                  <TableHead>Student</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedRows.map(({ student, period, assessment }) => (
                  <TableRow key={student.id}>
                    <TableCell className="min-w-0">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {student.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      {student.gender ? (
                        <Badge
                          variant="secondary"
                          className={GENDER_BADGE_CLASSES[student.gender]}
                        >
                          {GENDER_LABELS[student.gender]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.studentClass ? (
                        <Badge variant="secondary">
                          {STUDENT_CLASS_LABELS[student.studentClass]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {period?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      {assessment ? (
                        <AssessmentStatusBadge status={assessment.status} />
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground"
                        >
                          Not started
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {assessment && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={ROUTES.assessmentDetail(assessment.id)}>
                            View <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
=======
                  <TableHead>Period</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead className="w-56">Completion</TableHead>
                  <TableHead className="text-right">Drill down</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(periods.data ?? []).map((period) => {
                  const periodAssessments = byPeriod(period.id)
                  const completed = periodAssessments.filter(
                    (assessment) => assessment.status === 'completed'
                  ).length
                  const percent =
                    periodAssessments.length === 0
                      ? 0
                      : Math.round((completed / periodAssessments.length) * 100)
                  return (
                    <TableRow key={period.id}>
                      <TableCell className="font-medium">
                        {period.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatDate(period.startDate)} –{' '}
                        {formatDate(period.endDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={percent}
                            aria-label={`${period.name} completion`}
                            className="h-1.5"
                          />
                          <span className="text-muted-foreground w-20 shrink-0 font-mono text-xs tabular-nums">
                            {completed}/{periodAssessments.length} · {percent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDrillPeriodId(
                              drillPeriodId === period.id ? null : period.id
                            )
                          }
                        >
                          {drillPeriodId === period.id ? 'Hide' : 'Open'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
>>>>>>> origin/main
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
<<<<<<< HEAD
=======

      {drillPeriod && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              {drillPeriod.name} — all assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {drillRows.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    {assessment.studentName}
                    <AssessmentStatusBadge status={assessment.status} />
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.assessmentDetail(assessment.id)}>
                    View <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
>>>>>>> origin/main
    </div>
  )
}
