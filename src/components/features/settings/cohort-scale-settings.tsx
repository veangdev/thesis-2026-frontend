'use client'

import * as React from 'react'
import { Scale } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCohort, useUpdateCohort } from '@/features/cohorts'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Scoring-scale configuration (spec §6/§7): switching a cohort 5 ↔ 10
 * re-derives every scoring input, chart axis, gap calc, and zone band.
 */
export function CohortScaleSettings({ cohortId }: { cohortId: string }) {
  const cohort = useCohort(cohortId)
  const updateCohort = useUpdateCohort()
  const [pendingScale, setPendingScale] = React.useState<number | null>(null)

  if (cohort.isLoading || !cohort.data) {
    return <Skeleton className="h-48 w-full" />
  }

  const current = cohort.data.scoringScaleMax

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2 text-base">
          <Scale className="size-4" /> Scoring scale
        </CardTitle>
        <CardDescription>
          {cohort.data.name} currently scores on a{' '}
          <strong>{current}-point scale</strong>. Every star input, slider,
          radar axis, and growth-zone band derives from this value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={String(current)}
          onValueChange={(value) => {
            const next = Number(value)
            if (next !== current) setPendingScale(next)
          }}
          className="gap-3"
        >
          <Label
            htmlFor="scale-5"
            className="has-[[data-state=checked]]:border-primary flex cursor-pointer items-start gap-3 rounded-xl border p-4"
          >
            <RadioGroupItem value="5" id="scale-5" className="mt-0.5" />
            <span>
              <span className="block font-medium">5-point scale (default)</span>
              <span className="text-muted-foreground block text-sm">
                Star ratings 1–5 — quick to reason about, matches Outcomes Star.
              </span>
            </span>
          </Label>
          <Label
            htmlFor="scale-10"
            className="has-[[data-state=checked]]:border-primary flex cursor-pointer items-start gap-3 rounded-xl border p-4"
          >
            <RadioGroupItem value="10" id="scale-10" className="mt-0.5" />
            <span>
              <span className="block font-medium">10-point scale</span>
              <span className="text-muted-foreground block text-sm">
                Slider 1–10 — finer resolution for longer programs.
              </span>
            </span>
          </Label>
        </RadioGroup>

        <ConfirmDialog
          open={pendingScale !== null}
          onOpenChange={(open) => !open && setPendingScale(null)}
          title={`Switch to a ${pendingScale}-point scale?`}
          description="Existing scores keep their recorded values; charts and inputs re-derive from the new maximum. Do this between cycles, not mid-assessment."
          confirmLabel="Switch scale"
          onConfirm={() => {
            if (pendingScale === null) return
            updateCohort.mutate(
              {
                id: cohortId,
                payload: { scoringScaleMax: pendingScale },
              },
              {
                onSuccess: () =>
                  toast.success(
                    `${cohort.data?.name} now scores on a ${pendingScale}-point scale`
                  ),
              }
            )
            setPendingScale(null)
          }}
        />
      </CardContent>
    </Card>
  )
}
