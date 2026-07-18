'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Calendar,
  MessageSquareHeart,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react'
import { GrowthLine, JourneyRadar } from '@/components/charts'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { useStudentAnalytics } from '@/features/analytics'
import { useAssessments } from '@/features/assessments'
import { useAuthStore } from '@/features/auth'
import { useCoachingSessions } from '@/features/coaching'
import { useGoals } from '@/features/goals'
import { formatDate } from '@/lib/utils'

/** Self-Assessor home: progress, star, trends, goals, coaching — growth-toned. */
export function StudentDashboard() {
  const user = useAuthStore((state) => state.user)
  const studentId = user?.id

  const analytics = useStudentAnalytics(studentId)
  const assessments = useAssessments(studentId ? { studentId } : undefined)
  const goals = useGoals(studentId ? { studentId } : undefined)
  const coaching = useCoachingSessions(
    studentId ? { studentId, status: 'scheduled' } : undefined
  )

  if (analytics.isError) {
    return (
      <ErrorState
        title="Couldn't load your dashboard"
        description={analytics.error.message}
        onRetry={() => analytics.refetch()}
      />
    )
  }

  const data = analytics.data
  const completedCycles =
    data?.cycles.filter((cycle) => cycle.average !== null).length ?? 0
  const totalCycles = data?.cycles.length ?? 0
  const journeyPercent =
    totalCycles === 0 ? 0 : Math.round((completedCycles / totalCycles) * 100)

  const latestCycle = data
    ? [...data.cycles].reverse().find((cycle) => cycle.average !== null)
    : undefined
  const radarData =
    latestCycle?.scores.map((score) => ({
      dimension: score.dimensionName,
      self: score.self,
      mentor: score.mentor,
    })) ?? []

  const trendData =
    data?.cycles.map((cycle) => ({
      label: cycle.periodName.replace(/ —.*$/, ''),
      average: cycle.average,
    })) ?? []

  const draftAssessment = assessments.data?.data.find(
    (assessment) => assessment.status === 'draft'
  )
  const latestFeedback = assessments.data?.data.find(
    (assessment) => assessment.overallFeedback
  )
  const activeGoals = (goals.data?.data ?? []).filter(
    (goal) => goal.status === 'active'
  )
  const achievedGoals = (goals.data?.data ?? []).filter(
    (goal) => goal.status === 'achieved'
  )
  const nextSession = coaching.data?.data[0]

  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6">
      {/* Welcome hero + journey progress */}
      <Card className="from-brand-navy relative overflow-hidden bg-gradient-to-r via-[oklch(0.4_0.13_275)] to-[oklch(0.5_0.12_290)] text-white">
        <CardContent className="space-y-4 py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm text-white/80">
                <Sparkles className="size-4" /> Keep growing
              </p>
              <h2 className="font-heading text-2xl font-semibold">
                Welcome back, {firstName}!
              </h2>
              <p className="max-w-xl text-sm text-white/80">
                Every cycle adds a point to your star — from your first day at
                PNC to your first day of employment.
              </p>
            </div>
            {draftAssessment && (
              <Button
                asChild
                className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
              >
                <Link href={ROUTES.assessmentDetail(draftAssessment.id)}>
                  Continue {draftAssessment.periodName.replace(/ —.*$/, '')}{' '}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/80">
              <span>Journey progress</span>
              <span className="font-mono tabular-nums">
                {completedCycles}/{totalCycles} cycles
              </span>
            </div>
            <Progress
              value={journeyPercent}
              className="[&>[data-slot=progress-indicator]]:bg-brand-gold bg-white/20"
              aria-label="Journey progress"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Journey Star radar */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-heading flex items-center gap-2 text-base">
                <Star className="text-brand-gold size-4" /> My Journey Star
              </CardTitle>
              <CardDescription>
                {latestCycle
                  ? `${latestCycle.periodName} · ${data?.scoringScaleMax}-point scale`
                  : 'Your star appears after your first completed cycle'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.journeyStar}>
                Explore <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {analytics.isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : radarData.length > 0 && data ? (
              <JourneyRadar
                data={radarData}
                series={[
                  { key: 'self', label: 'Self' },
<<<<<<< HEAD
                  { key: 'mentor', label: 'Mentor' },
=======
                  { key: 'mentor', label: 'Facilitator' },
>>>>>>> origin/main
                ]}
                scaleMax={data.scoringScaleMax}
                height={280}
              />
            ) : (
              <EmptyState
                icon={Star}
                title="No completed cycle yet"
                description="Finish your first self-assessment to light up your star."
              />
            )}
          </CardContent>
        </Card>

        {/* Growth trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <TrendingUp className="text-brand-emerald size-4" /> Growth trend
            </CardTitle>
            <CardDescription>
              Average agreed score per cycle
              {data?.trend === 'improving' &&
                ' — trending up, keep it going! 🚀'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : trendData.some((point) => point.average !== null) && data ? (
              <GrowthLine
                data={trendData}
                series={[{ key: 'average', label: 'Average score' }]}
                scaleMax={data.scoringScaleMax}
                height={256}
              />
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="Trends unlock after two cycles"
                description="Complete assessments to see your growth curve."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Goals */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <Target className="text-brand-navy dark:text-chart-1 size-4" /> My
              goals
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.goals}>
                All <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : activeGoals.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No active goals"
<<<<<<< HEAD
                description="Set a goal with your mentor to focus your next cycle."
=======
                description="Set a goal with your facilitator to focus your next cycle."
>>>>>>> origin/main
              />
            ) : (
              activeGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{goal.title}</span>
                    <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                      {goal.progress}%
                    </span>
                  </div>
                  <Progress value={goal.progress} aria-label={goal.title} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Coaching reminder */}
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
          <CardContent>
            {coaching.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : nextSession ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium">{nextSession.title}</p>
                <p className="text-muted-foreground">
                  {formatDate(nextSession.scheduledAt)} ·{' '}
                  {nextSession.durationMinutes} min with{' '}
                  {nextSession.facilitatorName}
                </p>
                <Badge variant="secondary" className="mt-1">
                  {nextSession.scope}
                </Badge>
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming sessions"
<<<<<<< HEAD
                description="Your mentor will schedule the next one soon."
=======
                description="Your facilitator will schedule the next one soon."
>>>>>>> origin/main
              />
            )}
          </CardContent>
        </Card>

        {/* Mentor feedback + badges */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-base">
              <MessageSquareHeart className="text-brand-gold size-4" /> From
<<<<<<< HEAD
              your mentor
=======
              your facilitator
>>>>>>> origin/main
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessments.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : latestFeedback ? (
              <blockquote className="bg-muted/50 rounded-xl p-3 text-sm italic">
                “{latestFeedback.overallFeedback}”
                <footer className="text-muted-foreground mt-1 text-xs not-italic">
                  {latestFeedback.periodName}
                </footer>
              </blockquote>
            ) : (
              <p className="text-muted-foreground text-sm">
                Feedback appears here after your first mentor review.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {completedCycles > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Award className="size-3" /> {completedCycles} cycle
                  {completedCycles > 1 ? 's' : ''} completed
                </Badge>
              )}
              {achievedGoals.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Target className="size-3" /> {achievedGoals.length} goal
                  {achievedGoals.length > 1 ? 's' : ''} achieved
                </Badge>
              )}
              {data?.trend === 'improving' && (
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="size-3" /> On the rise
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
