'use client'

import Link from 'next/link'
import { ArrowLeft, GitCompareArrows } from 'lucide-react'
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
import { SERIES_COLORS } from '@/components/charts'
import { ROUTES } from '@/constants/routes'
import { useGapAnalysis } from '@/features/analytics'
import { cn } from '@/lib/utils'

/**
 * Gap analysis (spec §6): per-dimension self-vs-mentor comparison with
<<<<<<< HEAD
 * severity buckets and the mentor's discussion note where one exists.
=======
 * severity buckets and the facilitator's discussion note where one exists.
>>>>>>> origin/main
 */
export function GapAnalysisView({ assessmentId }: { assessmentId: string }) {
  const gap = useGapAnalysis(assessmentId)

  if (gap.isError) {
    return (
      <ErrorState
        description={gap.error.message}
        onRetry={() => gap.refetch()}
      />
    )
  }
  if (gap.isLoading || !gap.data) {
    return <Skeleton className="h-96 w-full" />
  }

  const data = gap.data
  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={GitCompareArrows}
        title="No gap data yet"
<<<<<<< HEAD
        description="Gap analysis unlocks once both self and mentor scores exist."
=======
        description="Gap analysis unlocks once both self and facilitator scores exist."
>>>>>>> origin/main
        action={
          <Button variant="outline" asChild>
            <Link href={ROUTES.assessmentDetail(assessmentId)}>
              <ArrowLeft className="size-4" /> Back to the assessment
            </Link>
          </Button>
        }
      />
    )
  }

  const aligned = data.items.filter((item) => item.severity === 'aligned')
  const significant = data.items.filter(
    (item) => item.severity === 'significant'
  )

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.assessmentDetail(assessmentId)}>
            <ArrowLeft className="size-4" /> {data.periodName}
          </Link>
        </Button>
        <p className="text-muted-foreground text-sm">
          {data.studentName} · {data.scoringScaleMax}-point scale
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <GitCompareArrows className="size-5" /> Perception gap
          </CardTitle>
          <CardDescription>
            {aligned.length} aligned · {significant.length} significant gap
            {significant.length === 1 ? '' : 's'} — where the conversation
            matters most.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {data.items.map((item) => {
            const max = data.scoringScaleMax
            return (
              <div key={item.dimensionId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{item.dimensionName}</p>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-medium',
                      item.severity === 'aligned' &&
                        'bg-brand-emerald/15 text-brand-emerald',
                      item.severity === 'minor' &&
                        'bg-brand-gold/15 text-brand-gold',
                      item.severity === 'significant' &&
                        'bg-destructive/15 text-destructive'
                    )}
                  >
                    {item.severity === 'aligned'
                      ? 'Aligned'
                      : `${item.gap > 0 ? '+' : ''}${item.gap} ${item.severity}`}
                  </span>
                </div>

                {/* Paired bars: self vs mentor on the same scale. */}
                <div className="space-y-1">
                  {(
                    [
                      {
                        label: 'Self',
                        value: item.self,
                        color: SERIES_COLORS.self,
                      },
                      {
<<<<<<< HEAD
                        label: 'Mentor',
=======
                        label: 'Facilitator',
>>>>>>> origin/main
                        value: item.mentor,
                        color: SERIES_COLORS.mentor,
                      },
                    ] as const
                  ).map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span className="text-muted-foreground w-12 text-xs">
                        {bar.label}
                      </span>
                      <div className="bg-muted h-2.5 flex-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(bar.value / max) * 100}%`,
                            backgroundColor: bar.color,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right font-mono text-xs tabular-nums">
                        {bar.value}/{max}
                      </span>
                    </div>
                  ))}
                </div>

                {item.note && (
                  <p className="text-muted-foreground bg-muted/40 rounded-lg p-2 text-xs">
                    “{item.note}”
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
