'use client'

import { BarChart3 } from 'lucide-react'
import { GrowthLine } from '@/components/charts'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
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
import type { Assessment } from '@/features/assessments'
import { useAssessments } from '@/features/assessments'
import { useAuthStore } from '@/features/auth'
import { useCohorts } from '@/features/cohorts'
import { useFacilitatorStudents } from '@/features/users'
import { getZone, zoneCssVar, zoneLabel } from '@/lib/scoring'

function assessmentAverage(assessment: Assessment): number | null {
  const scores =
    assessment.agreedScores.length > 0
      ? assessment.agreedScores.map((score) => score.score)
      : assessment.selfScores.map((score) => score.score)
  if (scores.length === 0) return null
  return scores.reduce((sum, value) => sum + value, 0) / scores.length
}

/** Facilitator reports: roster growth + per-student standings. */
export function FacilitatorReports() {
  const user = useAuthStore((state) => state.user)
  const roster = useFacilitatorStudents(user?.id)
  const assessments = useAssessments(
    user ? { facilitatorId: user.id, pageSize: 200 } : undefined
  )
  const cohorts = useCohorts()

  if (assessments.isError) {
    return (
      <ErrorState
        description={assessments.error.message}
        onRetry={() => assessments.refetch()}
      />
    )
  }
  if (assessments.isLoading || roster.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const students = roster.data ?? []
  const rows = assessments.data?.data ?? []
  const completed = rows.filter(
    (assessment) => assessment.status === 'completed'
  )
  const scaleFor = (cohortId?: string) =>
    cohorts.data?.data.find((cohort) => cohort.id === cohortId)
      ?.scoringScaleMax ?? 5

  if (completed.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No completed reviews yet"
        description="Reports build up as your reviews complete."
      />
    )
  }

  // Roster average per cycle.
  const periodOrder: string[] = []
  const buckets = new Map<string, { total: number; count: number }>()
  for (const assessment of [...completed].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  )) {
    const average = assessmentAverage(assessment)
    if (average === null) continue
    const key = assessment.periodName.replace(/ —.*$/, '')
    if (!buckets.has(key)) {
      buckets.set(key, { total: 0, count: 0 })
      periodOrder.push(key)
    }
    const bucket = buckets.get(key)!
    bucket.total += average
    bucket.count += 1
  }
  const trendData = periodOrder.map((key) => {
    const bucket = buckets.get(key)!
    return {
      label: key,
      average: Math.round((bucket.total / bucket.count) * 10) / 10,
    }
  })

  // Per-student latest standing.
  const standings = students.map((student) => {
    const latest = completed
      .filter((assessment) => assessment.studentId === student.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    const average = latest ? assessmentAverage(latest) : null
    const scaleMax = scaleFor(student.cohortId)
    return {
      student,
      average: average === null ? null : Math.round(average * 10) / 10,
      scaleMax,
      zone: average === null ? null : getZone(average, scaleMax),
      cycle: latest?.periodName ?? '—',
    }
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Roster growth
          </CardTitle>
          <CardDescription>
            Average completed score across your students, per cycle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GrowthLine
            data={trendData}
            series={[{ key: 'average', label: 'Roster average' }]}
            scaleMax={scaleFor(students[0]?.cohortId)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Student standings
          </CardTitle>
          <CardDescription>
            Latest completed cycle per self-assessor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Self-Assessor</TableHead>
                <TableHead>Latest cycle</TableHead>
                <TableHead className="text-right">Average</TableHead>
                <TableHead className="text-right">Zone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map(({ student, average, scaleMax, zone, cycle }) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-sm">{cycle}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {average === null ? '–' : `${average}/${scaleMax}`}
                  </TableCell>
                  <TableCell className="text-right">
                    {zone ? (
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: zoneCssVar(zone) }}
                        />
                        {zoneLabel(zone)}
                      </span>
                    ) : (
                      '–'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
