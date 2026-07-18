'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check, CheckCheck, Handshake, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ScoreInput } from '@/components/features/assessments/score-input'
import { ROUTES } from '@/constants/routes'
import type {
  Assessment,
  CoachingTag,
  MentorScore,
} from '@/features/assessments'
import {
  COACHING_TAG_LABELS,
  useSaveMentorAssessment,
  useSubmitMentorAssessment,
} from '@/features/assessments'
import type { Dimension } from '@/features/cohorts'
import { scoreGap } from '@/lib/scoring'
import { cn } from '@/lib/utils'
import { AssessmentStatusBadge } from './assessment-status-badge'

interface ReviewEntry {
  score: number | null
  note: string
  coachingTag?: CoachingTag
  agreed: number | null
}

interface MentorReviewWorkspaceProps {
  assessment: Assessment
  dimensions: Dimension[]
  scaleMax: number
}

/**
 * Side-by-side mentor review (spec §6): student self-scores read-only on the
 * left ← → mentor scoring on the right, per-dimension gap indicators,
 * discussion notes, coaching tags, and the final agreed score. Drives the
 * status machine self_submitted → mentor_review → agreed → completed.
 */
export function MentorReviewWorkspace({
  assessment,
  dimensions,
  scaleMax,
}: MentorReviewWorkspaceProps) {
  const saveMentor = useSaveMentorAssessment()
  const submitMentor = useSubmitMentorAssessment()

  const [entries, setEntries] = React.useState<Record<string, ReviewEntry>>(
    () => {
      const initial: Record<string, ReviewEntry> = {}
      for (const dimension of dimensions) {
        const mentor = assessment.mentorScores.find(
          (score) => score.dimensionId === dimension.id
        )
        const agreed = assessment.agreedScores.find(
          (score) => score.dimensionId === dimension.id
        )
        initial[dimension.id] = {
          score: mentor?.score ?? null,
          note: mentor?.note ?? '',
          coachingTag: mentor?.coachingTag,
          agreed: agreed?.score ?? null,
        }
      }
      return initial
    }
  )
  const [overallFeedback, setOverallFeedback] = React.useState(
    assessment.overallFeedback ?? ''
  )
  const [status, setStatus] = React.useState(assessment.status)

  const scoredCount = dimensions.filter(
    (dimension) => entries[dimension.id]?.score !== null
  ).length
  const agreedCount = dimensions.filter(
    (dimension) => entries[dimension.id]?.agreed !== null
  ).length
  const allScored = scoredCount === dimensions.length
  const allAgreed = agreedCount === dimensions.length

  function buildScores(): MentorScore[] {
    return dimensions.flatMap((dimension) => {
      const entry = entries[dimension.id]
      if (entry?.score == null) return []
      return [
        {
          dimensionId: dimension.id,
          score: entry.score,
          note: entry.note || undefined,
          coachingTag: entry.coachingTag,
        },
      ]
    })
  }

  function buildAgreed() {
    return dimensions.flatMap((dimension) => {
      const entry = entries[dimension.id]
      if (entry?.agreed == null) return []
      return [{ dimensionId: dimension.id, score: entry.agreed }]
    })
  }

  async function handleSave(markAgreed: boolean) {
    try {
      const updated = (await saveMentor.mutateAsync({
        id: assessment.id,
        payload: {
          scores: buildScores(),
          agreedScores: buildAgreed(),
          overallFeedback: overallFeedback || undefined,
          markAgreed,
        },
      })) as Assessment
      setStatus(updated.status)
      toast.success(
        markAgreed
          ? 'Scores agreed — ready to complete'
          : 'Review progress saved'
      )
    } catch {
      // Hook toasts the error.
    }
  }

  async function handleComplete() {
    try {
      const updated = (await submitMentor.mutateAsync(
        assessment.id
      )) as Assessment
      setStatus(updated.status)
      toast.success(`${assessment.studentName}'s cycle is complete 🎉`)
    } catch {
      // Hook toasts the error.
    }
  }

  const busy = saveMentor.isPending || submitMentor.isPending
  const readOnly = status === 'completed'

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="font-heading">
              {assessment.studentName} — {assessment.periodName}
            </CardTitle>
            <CardDescription>
              Compare, discuss, and agree final scores · {scaleMax}-point scale
            </CardDescription>
          </div>
          <AssessmentStatusBadge status={status} />
        </CardHeader>
        {assessment.overallReflection && (
          <CardContent>
            <blockquote className="bg-muted/50 rounded-xl p-3 text-sm italic">
              “{assessment.overallReflection}”
              <footer className="text-muted-foreground mt-1 text-xs not-italic">
                {assessment.studentName}&apos;s overall reflection
              </footer>
            </blockquote>
          </CardContent>
        )}
      </Card>

      {dimensions.map((dimension) => {
        const self = assessment.selfScores.find(
          (score) => score.dimensionId === dimension.id
        )
        const entry = entries[dimension.id]
        const gap =
          self && entry?.score != null
            ? scoreGap(self.score, entry.score, scaleMax)
            : null

        return (
          <Card key={dimension.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="font-heading text-base">
                  {dimension.name}
                </CardTitle>
                {gap && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      gap.severity === 'aligned' &&
                        'bg-brand-emerald/15 text-brand-emerald',
                      gap.severity === 'minor' &&
                        'bg-brand-gold/15 text-brand-gold',
                      gap.severity === 'significant' &&
                        'bg-destructive/15 text-destructive'
                    )}
                  >
                    {gap.severity === 'aligned'
                      ? 'Aligned'
                      : `Gap ${gap.value > 0 ? '+' : ''}${gap.value}`}
                  </span>
                )}
              </div>
              <CardDescription>{dimension.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Left: student's self-assessment (read-only) */}
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
<<<<<<< HEAD
                  Student self-score
=======
                  Self-score
>>>>>>> origin/main
                </p>
                <p className="font-mono text-2xl font-semibold tabular-nums">
                  {self ? `${self.score}/${scaleMax}` : '–'}
                </p>
                {self?.reflection && (
                  <p className="text-muted-foreground bg-muted/40 rounded-lg p-2.5 text-sm">
                    “{self.reflection}”
                  </p>
                )}
              </div>

              {/* Right: mentor scoring */}
              <div className="space-y-4 md:border-l md:pl-6">
                <div className="space-y-1.5">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Your score
                  </p>
                  <ScoreInput
<<<<<<< HEAD
                    label={`${dimension.name} mentor`}
=======
                    label={`${dimension.name} facilitator`}
>>>>>>> origin/main
                    value={entry?.score ?? null}
                    scaleMax={scaleMax}
                    disabled={readOnly}
                    onChange={(score) =>
                      setEntries((current) => ({
                        ...current,
                        [dimension.id]: { ...current[dimension.id], score },
                      }))
                    }
                  />
                </div>
                <Textarea
                  rows={2}
                  placeholder="Discussion notes for this dimension…"
                  value={entry?.note ?? ''}
                  disabled={readOnly}
                  onChange={(event) =>
                    setEntries((current) => ({
                      ...current,
                      [dimension.id]: {
                        ...current[dimension.id],
                        note: event.target.value,
                      },
                    }))
                  }
                />
                <div className="flex flex-wrap items-end gap-4">
                  <div className="min-w-40 space-y-1.5">
                    <p className="text-muted-foreground text-xs font-medium">
                      Coaching tag
                    </p>
                    <Select
                      value={entry?.coachingTag ?? ''}
                      disabled={readOnly}
                      onValueChange={(value) =>
                        setEntries((current) => ({
                          ...current,
                          [dimension.id]: {
                            ...current[dimension.id],
                            coachingTag: value as CoachingTag,
                          },
                        }))
                      }
                    >
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Tag (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          Object.entries(COACHING_TAG_LABELS) as [
                            CoachingTag,
                            string,
                          ][]
                        ).map(([tag, tagLabel]) => (
                          <SelectItem key={tag} value={tag}>
                            {tagLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground text-xs font-medium">
                      Final agreed score
                    </p>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: scaleMax }, (_, i) => i + 1).map(
                        (candidate) => (
                          <button
                            key={candidate}
                            type="button"
                            disabled={readOnly}
                            aria-label={`Agreed ${candidate} of ${scaleMax} for ${dimension.name}`}
                            onClick={() =>
                              setEntries((current) => ({
                                ...current,
                                [dimension.id]: {
                                  ...current[dimension.id],
                                  agreed: candidate,
                                },
                              }))
                            }
                            className={cn(
                              'flex size-7 items-center justify-center rounded-md border font-mono text-xs font-medium tabular-nums transition-colors',
                              entry?.agreed === candidate
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'hover:bg-accent'
                            )}
                          >
                            {candidate}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Overall feedback
          </CardTitle>
          <CardDescription>
            Shared with {assessment.studentName} once the cycle completes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            placeholder="Summarize the conversation and next steps…"
            value={overallFeedback}
            disabled={readOnly}
            onChange={(event) => setOverallFeedback(event.target.value)}
          />
        </CardContent>
      </Card>

      <Separator />

      {readOnly ? (
        <div className="flex items-center justify-between">
          <p className="text-brand-emerald flex items-center gap-2 text-sm font-medium">
<<<<<<< HEAD
            <CheckCheck className="size-4" /> Cycle completed — great mentoring!
=======
            <CheckCheck className="size-4" /> Cycle completed — great
            facilitating!
>>>>>>> origin/main
          </p>
          <Button variant="outline" asChild>
            <Link href={ROUTES.assessmentGap(assessment.id)}>
              View gap analysis
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            {scoredCount}/{dimensions.length} scored · {agreedCount}/
            {dimensions.length} agreed
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={busy}
            >
              {saveMentor.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save progress
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSave(true)}
              disabled={!allScored || !allAgreed || busy || status === 'agreed'}
            >
              <Handshake className="size-4" /> Mark scores agreed
            </Button>
            <Button
              onClick={handleComplete}
              disabled={status !== 'agreed' || busy}
            >
              {submitMentor.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Complete cycle
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
