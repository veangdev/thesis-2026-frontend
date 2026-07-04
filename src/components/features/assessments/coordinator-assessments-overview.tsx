'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ErrorState } from '@/components/shared/error-state'
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
import { useCohortPeriods, useCohorts } from '@/features/cohorts'
import { formatDate } from '@/lib/utils'
import { AssessmentStatusBadge } from './assessment-status-badge'

/** Coordinator /assessments: per-period completion tracking + drill-down. */
export function CoordinatorAssessmentsOverview() {
  const cohorts = useCohorts()
  const [cohortId, setCohortId] = React.useState<string | undefined>()
  const activeCohortId = cohortId ?? cohorts.data?.data[0]?.id
  const periods = useCohortPeriods(activeCohortId)
  const assessments = useAssessments(
    activeCohortId ? { cohortId: activeCohortId, pageSize: 500 } : undefined
  )
  const [drillPeriodId, setDrillPeriodId] = React.useState<string | null>(null)

  if (assessments.isError) {
    return (
      <ErrorState
        description={assessments.error.message}
        onRetry={() => assessments.refetch()}
      />
    )
  }

  const rows = assessments.data?.data ?? []
  const byPeriod = (periodId: string) =>
    rows.filter((assessment) => assessment.periodId === periodId)

  const drillRows = drillPeriodId ? byPeriod(drillPeriodId) : []
  const drillPeriod = (periods.data ?? []).find(
    (period) => period.id === drillPeriodId
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={activeCohortId ?? ''}
          onValueChange={(value) => {
            setCohortId(value)
            setDrillPeriodId(null)
          }}
        >
          <SelectTrigger size="sm" className="w-72">
            <SelectValue placeholder="Pick a cohort" />
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
            Periods & completion
          </CardTitle>
          <CardDescription>
            Completed reviews out of expected assessments, per cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {periods.isLoading || assessments.isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
    </div>
  )
}
