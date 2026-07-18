'use client'

import Link from 'next/link'
import { GitCompareArrows } from 'lucide-react'
import { JourneyRadar, type RadarSeries } from '@/components/charts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES } from '@/constants/routes'
import type { Assessment } from '@/features/assessments'
import type { Dimension } from '@/features/cohorts'
import { scoreGap } from '@/lib/scoring'
import { AssessmentStatusBadge } from './assessment-status-badge'

interface AssessmentSummaryProps {
  assessment: Assessment
  dimensions: Dimension[]
  scaleMax: number
}

/** Read-only assessment view: radar overlay + per-dimension score table. */
export function AssessmentSummary({
  assessment,
  dimensions,
  scaleMax,
}: AssessmentSummaryProps) {
  const hasMentor = assessment.mentorScores.length > 0
  const hasAgreed = assessment.agreedScores.length > 0

  const radarData = dimensions.map((dimension) => ({
    dimension: dimension.name,
    self:
      assessment.selfScores.find((s) => s.dimensionId === dimension.id)
        ?.score ?? null,
    mentor:
      assessment.mentorScores.find((s) => s.dimensionId === dimension.id)
        ?.score ?? null,
    agreed:
      assessment.agreedScores.find((s) => s.dimensionId === dimension.id)
        ?.score ?? null,
  }))

  const series: RadarSeries[] = [
    { key: 'self', label: 'Self' },
    ...(hasMentor ? [{ key: 'mentor', label: 'Facilitator' }] : []),
    ...(hasAgreed ? [{ key: 'agreed', label: 'Agreed' }] : []),
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="font-heading">
              {assessment.periodName}
            </CardTitle>
            <CardDescription>
              {assessment.studentName} · scored on a {scaleMax}-point scale
            </CardDescription>
          </div>
          <AssessmentStatusBadge status={assessment.status} />
        </CardHeader>
        <CardContent>
          <JourneyRadar data={radarData} series={series} scaleMax={scaleMax} />
          {hasMentor && (
            <div className="mt-2 text-right">
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.assessmentGap(assessment.id)}>
                  <GitCompareArrows className="size-4" /> Gap analysis
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Scores by dimension
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dimension</TableHead>
                <TableHead className="text-right">Self</TableHead>
                {hasMentor && (
                  <TableHead className="text-right">Facilitator</TableHead>
                )}
                {hasAgreed && (
                  <TableHead className="text-right">Agreed</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dimensions.map((dimension) => {
                const self = assessment.selfScores.find(
                  (s) => s.dimensionId === dimension.id
                )
                const mentor = assessment.mentorScores.find(
                  (s) => s.dimensionId === dimension.id
                )
                const agreed = assessment.agreedScores.find(
                  (s) => s.dimensionId === dimension.id
                )
                const gap =
                  self && mentor
                    ? scoreGap(self.score, mentor.score, scaleMax)
                    : null
                return (
                  <TableRow key={dimension.id}>
                    <TableCell className="font-medium">
                      {dimension.name}
                      {gap && gap.severity === 'significant' && (
                        <span className="text-muted-foreground ml-1 text-xs">
                          (gap {gap.value > 0 ? '+' : ''}
                          {gap.value})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {self?.score ?? '–'}
                    </TableCell>
                    {hasMentor && (
                      <TableCell className="text-right font-mono tabular-nums">
                        {mentor?.score ?? '–'}
                      </TableCell>
                    )}
                    {hasAgreed && (
                      <TableCell className="text-right font-mono tabular-nums">
                        {agreed?.score ?? '–'}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {assessment.overallFeedback && (
            <div className="bg-muted/50 mt-4 rounded-xl p-3 text-sm">
              <p className="text-muted-foreground mb-1 text-xs font-medium">
                Facilitator feedback
              </p>
              {assessment.overallFeedback}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
