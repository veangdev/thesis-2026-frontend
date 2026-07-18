'use client'

import * as React from 'react'
import { Download, Star } from 'lucide-react'
import { JourneyRadar, type RadarSeries } from '@/components/charts'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { ROLES } from '@/constants/roles'
import { useStudentAnalytics } from '@/features/analytics'
import { useAuthStore } from '@/features/auth'
import { useUsers } from '@/features/users'
import {
  getZoneThresholds,
  zoneCssVar,
  zoneLabel,
  type GrowthZone,
} from '@/lib/scoring'

const OVERLAY_LIMIT = 3

interface JourneyStarViewProps {
  /** Deep-linked student (staff only); students always see their own star. */
  initialStudentId?: string
}

/**
 * Full-page Journey Star (spec §6): historical cycle overlays, self-vs-mentor
 * toggle, growth-zone legend, and export. Staff pick any student; students
 * see themselves.
 */
export function JourneyStarView({ initialStudentId }: JourneyStarViewProps) {
  const user = useAuthStore((state) => state.user)
  const isStudent = user?.role === ROLES.SELF_ASSESSOR

  const students = useUsers(
<<<<<<< HEAD
    !isStudent ? { role: ROLES.SELF_ASSESSOR, pageSize: 100 } : undefined
=======
    !isStudent ? { role: ROLES.SELF_ASSESSOR, pageSize: 100 } : undefined,
    { enabled: !isStudent }
>>>>>>> origin/main
  )
  const [pickedStudentId, setPickedStudentId] = React.useState<
    string | undefined
  >(initialStudentId)
  const studentId = isStudent ? user?.id : (pickedStudentId ?? undefined)

  const analytics = useStudentAnalytics(studentId)

  const [showMentor, setShowMentor] = React.useState(true)
  const [overlayPeriodIds, setOverlayPeriodIds] = React.useState<string[]>([])

  if (!isStudent && !studentId) {
    return (
      <div className="mx-auto max-w-md space-y-4 pt-12 text-center">
        <EmptyState
          icon={Star}
<<<<<<< HEAD
          title="Pick a student"
=======
          title="Pick a self-assessor"
>>>>>>> origin/main
          description="Choose whose Journey Star to explore."
        />
        <Select onValueChange={(value) => setPickedStudentId(value)}>
          <SelectTrigger className="mx-auto w-72">
<<<<<<< HEAD
            <SelectValue placeholder="Select a student…" />
=======
            <SelectValue placeholder="Select a self-assessor…" />
>>>>>>> origin/main
          </SelectTrigger>
          <SelectContent>
            {(students.data?.data ?? []).map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  if (analytics.isError) {
    return (
      <ErrorState
        description={analytics.error.message}
        onRetry={() => analytics.refetch()}
      />
    )
  }
  if (analytics.isLoading || !analytics.data) {
    return <Skeleton className="h-120 w-full" />
  }

  const data = analytics.data
  const scaleMax = data.scoringScaleMax
  const thresholds = getZoneThresholds(scaleMax)
  const cyclesWithData = data.cycles.filter((cycle) =>
    cycle.scores.some((score) => (score.agreed ?? score.self) !== null)
  )
  const latest = cyclesWithData[cyclesWithData.length - 1]

  if (!latest) {
    return (
      <EmptyState
        icon={Star}
        title="No star yet"
        description="The Journey Star appears after the first completed assessment."
      />
    )
  }

  const overlays = cyclesWithData.filter((cycle) =>
    overlayPeriodIds.includes(cycle.periodId)
  )

  const radarData = latest.scores.map((score) => {
    const datum: import('@/components/charts').RadarDatum = {
      dimension: score.dimensionName,
      current: score.agreed ?? score.self,
      mentor: showMentor ? score.mentor : null,
      self: showMentor ? score.self : null,
    }
    for (const overlay of overlays) {
      const overlayScore = overlay.scores.find(
        (candidate) => candidate.dimensionId === score.dimensionId
      )
      datum[overlay.periodId] = overlayScore
        ? (overlayScore.agreed ?? overlayScore.self)
        : null
    }
    return datum
  })

  const series: RadarSeries[] = showMentor
    ? [
        { key: 'self', label: 'Self' },
<<<<<<< HEAD
        { key: 'mentor', label: 'Mentor' },
=======
        { key: 'mentor', label: 'Facilitator' },
>>>>>>> origin/main
      ]
    : [{ key: 'current', label: latest.periodName.replace(/ —.*$/, '') }]
  for (const overlay of overlays) {
    series.push({
      key: overlay.periodId,
      label: overlay.periodName.replace(/ —.*$/, ''),
      muted: true,
    })
  }

  const zones: GrowthZone[] = ['struggling', 'developing', 'thriving']
  const zoneRanges: Record<GrowthZone, string> = {
    struggling: `1–${thresholds.strugglingMax}`,
    developing: `${thresholds.strugglingMax + 1}–${thresholds.developingMax}`,
    thriving: `${thresholds.developingMax + 1}–${scaleMax}`,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {!isStudent && (
            <Select
              value={studentId}
              onValueChange={(value) => {
                setPickedStudentId(value)
                setOverlayPeriodIds([])
              }}
            >
              <SelectTrigger size="sm" className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(students.data?.data ?? []).map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="flex items-center gap-2">
            <Switch
              id="mentor-toggle"
              checked={showMentor}
              onCheckedChange={setShowMentor}
            />
            <Label htmlFor="mentor-toggle" className="text-sm">
<<<<<<< HEAD
              Self vs mentor
=======
              Self vs facilitator
>>>>>>> origin/main
            </Label>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="size-4" /> Export
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Star className="fill-brand-gold text-brand-gold size-5" />
              {data.studentName}&apos;s Journey Star
            </CardTitle>
            <CardDescription>
              {latest.periodName} · {scaleMax}-point scale · trend:{' '}
              <span className="capitalize">{data.trend}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JourneyRadar
              data={radarData}
              series={series}
              scaleMax={scaleMax}
              height={460}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm">
                Compare cycles
              </CardTitle>
              <CardDescription className="text-xs">
                Overlay up to {OVERLAY_LIMIT} past cycles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {cyclesWithData
                .filter((cycle) => cycle.periodId !== latest.periodId)
                .map((cycle) => {
                  const checked = overlayPeriodIds.includes(cycle.periodId)
                  return (
                    <div
                      key={cycle.periodId}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`overlay-${cycle.periodId}`}
                        checked={checked}
                        disabled={
                          !checked && overlayPeriodIds.length >= OVERLAY_LIMIT
                        }
                        onCheckedChange={(value) =>
                          setOverlayPeriodIds((current) =>
                            value === true
                              ? [...current, cycle.periodId]
                              : current.filter((id) => id !== cycle.periodId)
                          )
                        }
                      />
                      <Label
                        htmlFor={`overlay-${cycle.periodId}`}
                        className="text-sm font-normal"
                      >
                        {cycle.periodName}
                      </Label>
                    </div>
                  )
                })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm">
                Growth zones
              </CardTitle>
              <CardDescription className="text-xs">
                Bands derive from the {scaleMax}-point scale.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {zones.map((zone) => (
                <div
                  key={zone}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: zoneCssVar(zone) }}
                    />
                    {zoneLabel(zone)}
                  </span>
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    {zoneRanges[zone]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm">
                Cycle averages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {cyclesWithData.map((cycle) => (
                <div
                  key={cycle.periodId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground truncate">
                    {cycle.periodName.replace(/ —.*$/, '')}
                  </span>
                  <span className="font-mono font-medium tabular-nums">
                    {cycle.average ?? '–'}/{scaleMax}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
