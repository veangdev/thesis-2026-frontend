'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ClipboardCheck,
  Users,
} from 'lucide-react'
import { GrowthLine } from '@/components/charts'
import { AssessmentStatusBadge } from '@/components/features/assessments/assessment-status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import type { Assessment } from '@/features/assessments'
import { useAssessments } from '@/features/assessments'
import { useAuthStore } from '@/features/auth'
import { useCoachingSessions } from '@/features/coaching'
import { useCohorts } from '@/features/cohorts'
import { useFacilitatorStudents } from '@/features/users'
import { getZone } from '@/lib/scoring'
import { formatDate, getInitials } from '@/lib/utils'

/** Average of agreed (fallback self) scores on one assessment. */
function assessmentAverage(assessment: Assessment): number | null {
  const scores =
    assessment.agreedScores.length > 0
      ? assessment.agreedScores.map((score) => score.score)
      : assessment.selfScores.map((score) => score.score)
  if (scores.length === 0) return null
  return scores.reduce((sum, value) => sum + value, 0) / scores.length
}

/** Facilitator home: roster status, review queue, alerts, schedule, trend. */
export function FacilitatorDashboard() {
  const user = useAuthStore((state) => state.user)
  const facilitatorId = user?.id

  const roster = useFacilitatorStudents(facilitatorId)
  const assessments = useAssessments(
    facilitatorId ? { facilitatorId, pageSize: 200 } : undefined
  )
  const coaching = useCoachingSessions(
    facilitatorId ? { facilitatorId, status: 'scheduled' } : undefined
  )
  const cohorts = useCohorts()

  if (roster.isError) {
    return (
      <ErrorState
        description={roster.error.message}
        onRetry={() => roster.refetch()}
      />
    )
  }

  const students = roster.data ?? []
  const allAssessments = assessments.data?.data ?? []
  const scaleFor = (cohortId?: string) =>
    cohorts.data?.data.find((cohort) => cohort.id === cohortId)
      ?.scoringScaleMax ?? 5

  // Active-cycle status per student (latest assessment by updatedAt).
  const latestByStudent = new Map<string, Assessment>()
  for (const assessment of allAssessments) {
    const existing = latestByStudent.get(assessment.studentId)
    if (!existing || assessment.createdAt > existing.createdAt) {
      latestByStudent.set(assessment.studentId, assessment)
    }
  }

  const reviewQueue = allAssessments
    .filter(
      (assessment) =>
        assessment.status === 'self_submitted' ||
        assessment.status === 'mentor_review'
    )
    .sort((a, b) =>
      (a.selfSubmittedAt ?? '').localeCompare(b.selfSubmittedAt ?? '')
    )

  // Priority alerts: students whose latest completed average sits in the
  // struggling zone of their cohort's scale.
  const alerts = students.flatMap((student) => {
    const completed = allAssessments
      .filter(
        (assessment) =>
          assessment.studentId === student.id &&
          assessment.status === 'completed'
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const latest = completed[0]
    if (!latest) return []
    const average = assessmentAverage(latest)
    const scaleMax = scaleFor(student.cohortId)
    if (average === null || getZone(average, scaleMax) !== 'struggling')
      return []
    return [{ student, average, scaleMax }]
  })

  // Roster average per period for the comparison chart.
  const periodOrder: string[] = []
  const periodSums = new Map<string, { total: number; count: number }>()
  for (const assessment of [...allAssessments].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  )) {
    const average = assessmentAverage(assessment)
    if (average === null || assessment.status !== 'completed') continue
    const key = assessment.periodName.replace(/ —.*$/, '')
    if (!periodSums.has(key)) {
      periodSums.set(key, { total: 0, count: 0 })
      periodOrder.push(key)
    }
    const bucket = periodSums.get(key)!
    bucket.total += average
    bucket.count += 1
  }
  const trendData = periodOrder.map((key) => {
    const bucket = periodSums.get(key)!
    return {
      label: key,
      average: Math.round((bucket.total / bucket.count) * 10) / 10,
    }
  })
  const rosterScale = scaleFor(students[0]?.cohortId)

  const nextSessions = (coaching.data?.data ?? []).slice(0, 3)
  const loading = roster.isLoading || assessments.isLoading

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Users className="size-4" /> Assigned students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold">{students.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <ClipboardCheck className="size-4" /> Pending reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold">{reviewQueue.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="size-4" /> Priority alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold">{alerts.length}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Review queue */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-heading text-base">
                Ready for review
              </CardTitle>
              <CardDescription>
                Submitted self-assessments waiting on you
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.assessments}>
                All <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            ) : reviewQueue.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title="Queue is clear"
                description="New submissions land here the moment students submit."
              />
            ) : (
              reviewQueue.slice(0, 5).map((assessment) => (
                <Link
                  key={assessment.id}
                  href={ROUTES.assessmentDetail(assessment.id)}
                  className="hover:bg-accent/60 flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {assessment.studentName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {assessment.periodName}
                      {assessment.selfSubmittedAt &&
                        ` · submitted ${formatDate(assessment.selfSubmittedAt)}`}
                    </p>
                  </div>
                  <AssessmentStatusBadge status={assessment.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Roster comparison chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Roster growth
            </CardTitle>
            <CardDescription>
              Average completed score across your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : trendData.length > 0 ? (
              <GrowthLine
                data={trendData}
                series={[{ key: 'average', label: 'Roster average' }]}
                scaleMax={rosterScale}
                height={224}
              />
            ) : (
              <EmptyState
                title="No completed cycles yet"
                description="The trend appears once reviews complete."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Roster with status badges */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-heading text-base">
                My students
              </CardTitle>
              <CardDescription>Current cycle status</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.teams}>
                Roster <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            ) : (
              students.map((student) => {
                const latest = latestByStudent.get(student.id)
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between gap-2 rounded-lg border p-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="truncate text-sm font-medium">
                        {student.name}
                      </p>
                    </div>
                    {latest && (
                      <AssessmentStatusBadge
                        status={latest.status}
                        className="shrink-0"
                      />
                    )}
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Alerts + coaching schedule */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2 text-base">
                <AlertTriangle className="text-destructive size-4" /> Priority
                alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : alerts.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No students in the struggling zone. 👏
                </p>
              ) : (
                alerts.map(({ student, average, scaleMax }) => (
                  <div
                    key={student.id}
                    className="border-destructive/30 bg-destructive/5 rounded-lg border p-2.5 text-sm"
                  >
                    <p className="font-medium">{student.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Latest average{' '}
                      <span className="font-mono tabular-nums">
                        {Math.round(average * 10) / 10}/{scaleMax}
                      </span>{' '}
                      — consider a coaching session
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="font-heading flex items-center gap-2 text-base">
                <Calendar className="text-brand-emerald size-4" /> Coaching
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={ROUTES.coaching}>
                  All <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {coaching.isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : nextSessions.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nothing scheduled yet.
                </p>
              ) : (
                nextSessions.map((session) => (
                  <div key={session.id} className="rounded-lg border p-2.5">
                    <p className="truncate text-sm font-medium">
                      {session.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(session.scheduledAt)} · {session.scope} ·{' '}
                      {session.participantIds.length} student
                      {session.participantIds.length > 1 ? 's' : ''}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
