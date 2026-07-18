'use client'

import { BarChart3, Download } from 'lucide-react'
import { GrowthLine, JourneyRadar } from '@/components/charts'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
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
import { useStudentAnalytics } from '@/features/analytics'
import { useAuthStore } from '@/features/auth'

/**
 * Student reports: cycle history, self-vs-mentor trend, per-cycle radar
 * comparison, and a print/download action.
 */
export function StudentReports() {
  const user = useAuthStore((state) => state.user)
  const analytics = useStudentAnalytics(user?.id)

  if (analytics.isError) {
    return (
      <ErrorState
        description={analytics.error.message}
        onRetry={() => analytics.refetch()}
      />
    )
  }
  if (analytics.isLoading || !analytics.data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const data = analytics.data
  const scaleMax = data.scoringScaleMax
  const cyclesWithData = data.cycles.filter((cycle) => cycle.average !== null)

  if (cyclesWithData.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No report data yet"
        description="Reports build up as you complete assessment cycles."
      />
    )
  }

  const trendData = data.cycles.map((cycle) => {
    const selfValues = cycle.scores
      .map((score) => score.self)
      .filter((value): value is number => value !== null)
    const mentorValues = cycle.scores
      .map((score) => score.mentor)
      .filter((value): value is number => value !== null)
    const average = (values: number[]) =>
      values.length === 0
        ? null
        : Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) /
          10
    return {
      label: cycle.periodName.replace(/ —.*$/, ''),
      self: average(selfValues),
      mentor: average(mentorValues),
    }
  })

  const latest = cyclesWithData[cyclesWithData.length - 1]
  const previous =
    cyclesWithData.length > 1 ? cyclesWithData[cyclesWithData.length - 2] : null
  const radarData = latest.scores.map((score) => {
    const previousScore = previous?.scores.find(
      (candidate) => candidate.dimensionId === score.dimensionId
    )
    return {
      dimension: score.dimensionName,
      current: score.agreed ?? score.self,
      previous: previousScore
        ? (previousScore.agreed ?? previousScore.self)
        : null,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="size-4" /> Download report
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Self vs mentor over time
            </CardTitle>
            <CardDescription>
              Average score per cycle — alignment shows shared understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthLine
              data={trendData}
              series={[
                { key: 'self', label: 'Self' },
<<<<<<< HEAD
                { key: 'mentor', label: 'Mentor' },
=======
                { key: 'mentor', label: 'Facilitator' },
>>>>>>> origin/main
              ]}
              scaleMax={scaleMax}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Cycle comparison
            </CardTitle>
            <CardDescription>
              {latest.periodName}
              {previous ? ` vs ${previous.periodName}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JourneyRadar
              data={radarData}
              series={[
                { key: 'current', label: 'Latest' },
                ...(previous
                  ? [{ key: 'previous', label: 'Previous', muted: true }]
                  : []),
              ]}
              scaleMax={scaleMax}
              height={260}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Assessment history
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cycle</TableHead>
                <TableHead className="text-right">Average</TableHead>
                <TableHead className="text-right">Strongest</TableHead>
                <TableHead className="text-right">Focus area</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cyclesWithData.map((cycle) => {
                const scored = cycle.scores.filter(
                  (score) => (score.agreed ?? score.self) !== null
                )
                const best = [...scored].sort(
                  (a, b) =>
                    ((b.agreed ?? b.self) as number) -
                    ((a.agreed ?? a.self) as number)
                )[0]
                const worst = [...scored].sort(
                  (a, b) =>
                    ((a.agreed ?? a.self) as number) -
                    ((b.agreed ?? b.self) as number)
                )[0]
                return (
                  <TableRow key={cycle.periodId}>
                    <TableCell className="font-medium">
                      {cycle.periodName}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {cycle.average ?? '–'}/{scaleMax}
                    </TableCell>
                    <TableCell className="text-right">
                      {best?.dimensionName ?? '–'}
                    </TableCell>
                    <TableCell className="text-right">
                      {worst?.dimensionName ?? '–'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
