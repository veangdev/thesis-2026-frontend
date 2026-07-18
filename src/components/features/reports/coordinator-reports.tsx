'use client'

import * as React from 'react'
import { Download, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { DimensionHeatmap, GrowthLine, JourneyRadar } from '@/components/charts'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { useCohortAnalytics, useOverviewAnalytics } from '@/features/analytics'
import { useCohorts } from '@/features/cohorts'
import { getZone, zoneCssVar, zoneLabel } from '@/lib/scoring'

/** Coordinator reports: cohort radar, heatmap, at-risk, workload, export. */
export function CoordinatorReports() {
  const cohorts = useCohorts()
  const overview = useOverviewAnalytics()
  const [cohortId, setCohortId] = React.useState<string | undefined>()
  const activeCohortId = cohortId ?? cohorts.data?.data[0]?.id
  const analytics = useCohortAnalytics(activeCohortId)

  if (analytics.isError) {
    return (
      <ErrorState
        description={analytics.error.message}
        onRetry={() => analytics.refetch()}
      />
    )
  }

  const data = analytics.data

  function exportCsv() {
    if (!data) return
    const dimensionNames = data.dimensionAverages.map(
      (dimension) => dimension.dimensionName
    )
<<<<<<< HEAD
    const header = ['Student', ...dimensionNames, 'Average'].join(',')
=======
    const header = ['Self-Assessor', ...dimensionNames, 'Average'].join(',')
>>>>>>> origin/main
    const lines = data.heatmap.map((row) => {
      const cells = data.dimensionAverages.map(
        (dimension) => row.scores[dimension.dimensionId] ?? ''
      )
      return [
        JSON.stringify(row.studentName),
        ...cells,
        row.average ?? '',
      ].join(',')
    })
    const blob = new Blob([[header, ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${data.cohortName.replace(/\W+/g, '-')}-report.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success('Report exported as CSV')
  }

  const atRisk = (data?.heatmap ?? []).filter(
    (row) =>
      row.average !== null &&
      data &&
      getZone(row.average, data.scoringScaleMax) !== 'thriving' &&
      (row.trend === 'regressing' ||
        getZone(row.average, data.scoringScaleMax) === 'struggling')
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select
          value={activeCohortId ?? ''}
          onValueChange={(value) => setCohortId(value)}
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
        <Button
          variant="outline"
          size="sm"
          onClick={exportCsv}
          disabled={!data}
        >
          <Download className="size-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Cohort radar
            </CardTitle>
            <CardDescription>
              Dimension averages, latest completed cycle
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.isLoading || !data ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <JourneyRadar
                data={data.dimensionAverages.map((dimension) => ({
                  dimension: dimension.dimensionName,
                  average: dimension.average,
                }))}
                series={[{ key: 'average', label: 'Cohort average' }]}
                scaleMax={data.scoringScaleMax}
                height={260}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Growth over cycles
            </CardTitle>
            <CardDescription>
              Cohort average per period · participation{' '}
              {data ? `${data.participationRate}%` : '…'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.isLoading || !data ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
                <GrowthLine
                  data={data.trendline.map((point) => ({
                    label: point.periodName.replace(/ —.*$/, ''),
                    average: point.average,
                  }))}
                  series={[{ key: 'average', label: 'Cohort average' }]}
                  scaleMax={data.scoringScaleMax}
                  height={210}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.weakestDimensions.map((dimension) => (
                    <span
                      key={dimension.dimensionId}
                      className="bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    >
                      <TrendingDown className="size-3" />
                      {dimension.dimensionName} · {dimension.average}
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Student × dimension heatmap
          </CardTitle>
          <CardDescription>
            {data
              ? `${data.cohortName} · ${data.scoringScaleMax}-point scale`
              : '…'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.isLoading || !data ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <DimensionHeatmap
              columns={data.dimensionAverages.map((dimension) => ({
                id: dimension.dimensionId,
                label: dimension.dimensionName,
              }))}
              rows={data.heatmap.map((row) => ({
                id: row.studentId,
                label: row.studentName,
                values: row.scores,
              }))}
              scaleMax={data.scoringScaleMax}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              At-risk students
            </CardTitle>
            <CardDescription>
              Struggling zone or regressing trajectory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.isLoading || !data ? (
              <Skeleton className="h-40 w-full" />
            ) : atRisk.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nobody flagged in this cohort. 🎉
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
<<<<<<< HEAD
                    <TableHead>Student</TableHead>
=======
                    <TableHead>Self-Assessor</TableHead>
>>>>>>> origin/main
                    <TableHead className="text-right">Average</TableHead>
                    <TableHead className="text-right">Zone</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atRisk.map((row) => {
                    const zone =
                      row.average !== null
                        ? getZone(row.average, data.scoringScaleMax)
                        : null
                    return (
                      <TableRow key={row.studentId}>
                        <TableCell className="font-medium">
                          {row.studentName}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {row.average}/{data.scoringScaleMax}
                        </TableCell>
                        <TableCell className="text-right">
                          {zone && (
                            <span className="inline-flex items-center gap-1.5 text-sm">
                              <span
                                className="size-2 rounded-full"
                                style={{ backgroundColor: zoneCssVar(zone) }}
                              />
                              {zoneLabel(zone)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-sm capitalize">
                          {row.trend}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Mentor effectiveness
            </CardTitle>
            <CardDescription>Roster size vs pending reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {overview.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facilitator</TableHead>
<<<<<<< HEAD
                    <TableHead className="text-right">Students</TableHead>
=======
                    <TableHead className="text-right">Self-Assessors</TableHead>
>>>>>>> origin/main
                    <TableHead className="text-right">Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(overview.data?.mentorWorkload ?? []).map((mentor) => (
                    <TableRow key={mentor.facilitatorId}>
                      <TableCell className="font-medium">
                        {mentor.facilitatorName}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {mentor.studentCount}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {mentor.pendingReviews}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
