'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  GraduationCap,
  Layers,
  Plus,
  Settings,
  TrendingDown,
  Users,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { DimensionHeatmap, GrowthLine } from '@/components/charts'
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
import { ROUTES } from '@/constants/routes'
<<<<<<< HEAD
import { useCohortAnalytics, useOverviewAnalytics } from '@/features/analytics'
import { useCohorts } from '@/features/cohorts'

/** Program Coordinator home: KPIs, cohort heatmap, workload, activity. */
export function CoordinatorDashboard() {
  const overview = useOverviewAnalytics()
  const cohorts = useCohorts()
  const [cohortId, setCohortId] = React.useState<string | undefined>(undefined)
  const activeCohortId = cohortId ?? cohorts.data?.data[0]?.id
  const cohortAnalytics = useCohortAnalytics(activeCohortId)
=======
import {
  useRealCohortAnalytics,
  useRealCohorts,
  useRealOverviewAnalytics,
} from '@/features/analytics'

/** Program Coordinator home: KPIs, cohort heatmap, workload, activity. */
export function CoordinatorDashboard() {
  // Real-API backed (see src/features/analytics/dashboard.hooks.ts).
  const overview = useRealOverviewAnalytics()
  const cohorts = useRealCohorts()
  const [cohortId, setCohortId] = React.useState<string | undefined>(undefined)
  const activeCohortId = cohortId ?? cohorts.data?.data[0]?.id
  const activeCohortName =
    cohorts.data?.data.find((c) => c.id === activeCohortId)?.name ?? ''
  const cohortAnalytics = useRealCohortAnalytics(
    activeCohortId,
    activeCohortName
  )
>>>>>>> origin/main

  if (overview.isError) {
    return (
      <ErrorState
        description={overview.error.message}
        onRetry={() => overview.refetch()}
      />
    )
  }

  const kpis = overview.data?.kpis
  const kpiCards = [
<<<<<<< HEAD
    { label: 'Students', value: kpis?.totalStudents, icon: GraduationCap },
=======
    {
      label: 'Self-Assessors',
      value: kpis?.totalStudents,
      icon: GraduationCap,
    },
>>>>>>> origin/main
    { label: 'Facilitators', value: kpis?.totalFacilitators, icon: Users },
    { label: 'Active cohorts', value: kpis?.activeCohorts, icon: Layers },
    {
      label: 'Cycle completion',
      value: kpis === undefined ? undefined : `${kpis.completionRate}%`,
      icon: ClipboardList,
    },
    { label: 'At risk', value: kpis?.atRiskCount, icon: AlertTriangle },
  ]

  const heat = cohortAnalytics.data

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpiCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4" /> {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {value === undefined ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                <p className="text-2xl font-semibold">{value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <Link href={ROUTES.users}>
            <Plus className="size-4" /> Manage users
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={ROUTES.teams}>
<<<<<<< HEAD
            <Users className="size-4" /> Assign mentors
=======
            <Users className="size-4" /> Assign facilitators
>>>>>>> origin/main
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={ROUTES.settings}>
            <Settings className="size-4" /> Configure periods & scales
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={ROUTES.assessments}>
            <ClipboardList className="size-4" /> Completion tracking
          </Link>
        </Button>
      </div>

      {/* Cohort heatmap */}
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="font-heading text-base">
              Cohort heatmap
            </CardTitle>
            <CardDescription>
              Latest completed cycle, per student × dimension
              {heat ? ` · ${heat.scoringScaleMax}-point scale` : ''}
            </CardDescription>
          </div>
          <Select
            value={activeCohortId ?? ''}
            onValueChange={(value) => setCohortId(value)}
          >
            <SelectTrigger size="sm" className="w-64">
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
        </CardHeader>
        <CardContent>
          {cohortAnalytics.isLoading || !heat ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <DimensionHeatmap
              columns={heat.dimensionAverages.map((dimension) => ({
                id: dimension.dimensionId,
                label: dimension.dimensionName,
              }))}
              rows={heat.heatmap.map((row) => ({
                id: row.studentId,
                label: row.studentName,
                values: row.scores,
              }))}
              scaleMax={heat.scoringScaleMax}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Weakest dimensions + trendline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Cohort growth & focus areas
            </CardTitle>
            <CardDescription>
              {heat?.cohortName ?? '…'} · participation{' '}
              {heat ? `${heat.participationRate}%` : '…'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cohortAnalytics.isLoading || !heat ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <>
<<<<<<< HEAD
                <GrowthLine
                  data={heat.trendline.map((point) => ({
                    label: point.periodName.replace(/ —.*$/, ''),
                    average: point.average,
                  }))}
                  series={[{ key: 'average', label: 'Cohort average' }]}
                  scaleMax={heat.scoringScaleMax}
                  height={220}
                />
=======
                {heat.trendline.length > 0 && (
                  <GrowthLine
                    data={heat.trendline.map((point) => ({
                      label: point.periodName.replace(/ —.*$/, ''),
                      average: point.average,
                    }))}
                    series={[{ key: 'average', label: 'Cohort average' }]}
                    scaleMax={heat.scoringScaleMax}
                    height={220}
                  />
                )}
>>>>>>> origin/main
                <div className="grid gap-2 sm:grid-cols-3">
                  {heat.weakestDimensions.map((dimension) => (
                    <div
                      key={dimension.dimensionId}
                      className="rounded-lg border p-2.5"
                    >
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        <TrendingDown className="text-destructive size-3.5" />
                        {dimension.dimensionName}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs tabular-nums">
                        avg {dimension.average ?? '–'}/{heat.scoringScaleMax}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

<<<<<<< HEAD
        {/* Mentor workload */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Mentor workload
            </CardTitle>
            <CardDescription>Students · pending reviews</CardDescription>
=======
        {/* Facilitator workload */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Facilitator workload
            </CardTitle>
            <CardDescription>Self-assessors · pending reviews</CardDescription>
>>>>>>> origin/main
          </CardHeader>
          <CardContent className="space-y-2">
            {overview.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              (overview.data?.mentorWorkload ?? []).map((mentor) => (
                <div
                  key={mentor.facilitatorId}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="truncate">{mentor.facilitatorName}</span>
                  <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                    {mentor.studentCount} ·{' '}
                    <span
                      className={
                        mentor.pendingReviews > 0
                          ? 'text-brand-gold font-semibold'
                          : ''
                      }
                    >
                      {mentor.pendingReviews} pending
                    </span>
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

<<<<<<< HEAD
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Submission activity
            </CardTitle>
            <CardDescription>
              Self-assessments submitted per week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overview.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <GrowthLine
                data={(overview.data?.activityTrend ?? []).map((point) => ({
                  label: point.label,
                  submissions: point.count,
                }))}
                series={[{ key: 'submissions', label: 'Submissions' }]}
                height={192}
              />
            )}
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <Activity className="size-4" /> Latest activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {overview.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              (overview.data?.activityFeed ?? []).slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-start gap-2 text-sm">
                  <span className="bg-brand-emerald mt-1.5 size-1.5 shrink-0 rounded-full" />
                  <div className="min-w-0">
                    <p className="truncate">{item.message}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(item.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href={ROUTES.assessments}>
                Assessment overview <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
=======
      {overview.data?.activityTrend?.length ||
      overview.data?.activityFeed?.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Activity trend */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Submission activity
              </CardTitle>
              <CardDescription>
                Self-assessments submitted per week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overview.isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <GrowthLine
                  data={(overview.data?.activityTrend ?? []).map((point) => ({
                    label: point.label,
                    submissions: point.count,
                  }))}
                  series={[{ key: 'submissions', label: 'Submissions' }]}
                  height={192}
                />
              )}
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2 text-base">
                <Activity className="size-4" /> Latest activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {overview.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                (overview.data?.activityFeed ?? []).slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-start gap-2 text-sm">
                    <span className="bg-brand-emerald mt-1.5 size-1.5 shrink-0 rounded-full" />
                    <div className="min-w-0">
                      <p className="truncate">{item.message}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(item.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href={ROUTES.assessments}>
                  Assessment overview <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
>>>>>>> origin/main
    </div>
  )
}
