'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Loader2, Save, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { ScoreInput } from '@/components/features/assessments/score-input'
import { ROUTES } from '@/constants/routes'
import type { Assessment, SelfScore } from '@/features/assessments'
import {
  useSaveSelfAssessment,
  useSubmitSelfAssessment,
} from '@/features/assessments'
import type { Dimension } from '@/features/cohorts'
import { getZone, zoneCssVar, zoneLabel } from '@/lib/scoring'

interface WizardEntry {
  score: number | null
  reflection: string
}

interface SelfAssessmentWizardProps {
  assessment: Assessment
  dimensions: Dimension[]
  scaleMax: number
}

/**
 * Multi-step self-assessment (spec §6): one step per dimension (scale-aware
 * score input + reflection), then a review step, then submit with a success
 * animation. Drafts save at any point and restore on return.
 */
export function SelfAssessmentWizard({
  assessment,
  dimensions,
  scaleMax,
}: SelfAssessmentWizardProps) {
  const saveSelf = useSaveSelfAssessment()
  const submitSelf = useSubmitSelfAssessment()

  const [step, setStep] = React.useState(0)
  const [entries, setEntries] = React.useState<Record<string, WizardEntry>>(
    () => {
      const initial: Record<string, WizardEntry> = {}
      for (const dimension of dimensions) {
        const existing = assessment.selfScores.find(
          (score) => score.dimensionId === dimension.id
        )
        initial[dimension.id] = {
          score: existing?.score ?? null,
          reflection: existing?.reflection ?? '',
        }
      }
      return initial
    }
  )
  const [overallReflection, setOverallReflection] = React.useState(
    assessment.overallReflection ?? ''
  )
  const [submitted, setSubmitted] = React.useState(false)

  const reviewStep = dimensions.length
  const isReview = step === reviewStep
  const currentDimension = dimensions[step] as Dimension | undefined
  const scoredCount = dimensions.filter(
    (dimension) => entries[dimension.id]?.score !== null
  ).length
  const allScored = scoredCount === dimensions.length
  const progress = Math.round(
    ((isReview ? dimensions.length : step) / (dimensions.length + 1)) * 100
  )

  function buildPayloadScores(): SelfScore[] {
    return dimensions.flatMap((dimension) => {
      const entry = entries[dimension.id]
      if (entry?.score == null) return []
      return [
        {
          dimensionId: dimension.id,
          score: entry.score,
          reflection: entry.reflection || undefined,
        },
      ]
    })
  }

  function saveDraft(showToast = true) {
    return saveSelf.mutateAsync(
      {
        id: assessment.id,
        payload: {
          scores: buildPayloadScores(),
          overallReflection: overallReflection || undefined,
        },
      },
      {
        onSuccess: () => {
          if (showToast) toast.success('Draft saved — pick up any time')
        },
      }
    )
  }

  async function handleSubmit() {
    try {
      await saveDraft(false)
      await submitSelf.mutateAsync(assessment.id)
      setSubmitted(true)
    } catch {
      // Hook toasts the error.
    }
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="space-y-5 py-12">
          <div className="bg-brand-gold/15 mx-auto flex size-20 animate-bounce items-center justify-center rounded-full">
            <Star className="fill-brand-gold text-brand-gold size-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold">
              Assessment submitted! 🎉
            </h2>
            <p className="text-muted-foreground text-sm">
              Great reflection work. Your facilitator will review your scores
              and schedule a conversation — watch your notifications.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href={ROUTES.dashboard}>Back to dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.journeyStar}>View my Journey Star</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const busy = saveSelf.isPending || submitSelf.isPending

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="space-y-1.5">
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>
            {isReview
              ? 'Review & submit'
              : `Dimension ${step + 1} of ${dimensions.length}`}
          </span>
          <span className="font-mono tabular-nums">
            {scoredCount}/{dimensions.length} scored
          </span>
        </div>
        <Progress value={progress} aria-label="Assessment progress" />
      </div>

      {!isReview && currentDimension ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              {currentDimension.name}
            </CardTitle>
            <CardDescription>{currentDimension.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Where are you today, honestly?
              </p>
              <ScoreInput
                label={currentDimension.name}
                value={entries[currentDimension.id]?.score ?? null}
                scaleMax={scaleMax}
                onChange={(score) =>
                  setEntries((current) => ({
                    ...current,
                    [currentDimension.id]: {
                      ...current[currentDimension.id],
                      score,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`reflection-${currentDimension.id}`}
                className="text-sm font-medium"
              >
                Reflection{' '}
                <span className="text-muted-foreground font-normal">
                  (optional — a moment that shows this score)
                </span>
              </label>
              <Textarea
                id={`reflection-${currentDimension.id}`}
                rows={3}
                placeholder="e.g. I led our stand-up twice this month and it felt natural…"
                value={entries[currentDimension.id]?.reflection ?? ''}
                onChange={(event) =>
                  setEntries((current) => ({
                    ...current,
                    [currentDimension.id]: {
                      ...current[currentDimension.id],
                      reflection: event.target.value,
                    },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Review your star
            </CardTitle>
            <CardDescription>
              Check every score, add an overall reflection, then submit for your
              facilitator&apos;s review. You can&apos;t edit after submitting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="divide-y">
              {dimensions.map((dimension, index) => {
                const entry = entries[dimension.id]
                const zone =
                  entry?.score != null ? getZone(entry.score, scaleMax) : null
                return (
                  <li
                    key={dimension.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {dimension.name}
                      </p>
                      {entry?.reflection && (
                        <p className="text-muted-foreground truncate text-xs">
                          {entry.reflection}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {entry?.score != null && zone ? (
                        <>
                          <span className="font-mono text-sm font-semibold tabular-nums">
                            {entry.score}/{scaleMax}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                            style={{ backgroundColor: zoneCssVar(zone) }}
                          >
                            {zoneLabel(zone)}
                          </span>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStep(index)}
                        >
                          Score it
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="space-y-2">
              <label
                htmlFor="overall-reflection"
                className="text-sm font-medium"
              >
                Overall reflection{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Textarea
                id="overall-reflection"
                rows={3}
                placeholder="What defined this cycle for you?"
                value={overallReflection}
                onChange={(event) => setOverallReflection(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0 || busy}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => saveDraft()} disabled={busy}>
            {saveSelf.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save draft
          </Button>
          {isReview ? (
            <Button onClick={handleSubmit} disabled={!allScored || busy}>
              {submitSelf.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Submit assessment
            </Button>
          ) : (
            <Button
              onClick={() => setStep((current) => current + 1)}
              disabled={
                busy || entries[currentDimension?.id ?? '']?.score == null
              }
            >
              Next <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
