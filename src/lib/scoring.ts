import { SCORE_ZONES, type ScoreZone } from '@/constants/app'

/**
 * Scoring-scale utilities. The ONLY place that understands a cohort's
 * `scoringScaleMax` (5 or 10, configurable per cohort — spec §3). Every
 * scoring input, chart axis, gap calculation, and growth-zone band must
 * derive from these helpers. Never hard-code a scale.
 */

export type GrowthZone = ScoreZone

export interface ZoneThresholds {
  /** Highest score (inclusive) that still counts as Struggling. */
  strugglingMax: number
  /** Highest score (inclusive) that still counts as Developing. */
  developingMax: number
}

/** Zone bands proportional to the scale: ≤40% struggling, ≤70% developing. */
export function getZoneThresholds(scaleMax: number): ZoneThresholds {
  return {
    strugglingMax: Math.round(scaleMax * 0.4),
    developingMax: Math.round(scaleMax * 0.7),
  }
}

export function getZone(score: number, scaleMax: number): GrowthZone {
  const { strugglingMax, developingMax } = getZoneThresholds(scaleMax)
  if (score <= strugglingMax) return 'struggling'
  if (score <= developingMax) return 'developing'
  return 'thriving'
}

export function zoneLabel(zone: GrowthZone): string {
  return SCORE_ZONES[zone].label
}

/** Design token name for a zone, e.g. `zone-thriving` → `var(--zone-thriving)`. */
export function zoneToken(zone: GrowthZone): string {
  return SCORE_ZONES[zone].token
}

export function zoneCssVar(zone: GrowthZone): string {
  return `var(--${SCORE_ZONES[zone].token})`
}

/** Chart axis domain for a cohort's scale. */
export function scaleDomain(scaleMax: number): [number, number] {
  return [0, scaleMax]
}

/** Tick values for a cohort's scale: 1..5, or 0/2/4/…/10 for larger scales. */
export function scaleTicks(scaleMax: number): number[] {
  const step = scaleMax > 6 ? 2 : 1
  const ticks: number[] = []
  for (let tick = 0; tick <= scaleMax; tick += step) ticks.push(tick)
  return ticks
}

/** All selectable score values (1..scaleMax). */
export function scoreValues(scaleMax: number): number[] {
  return Array.from({ length: scaleMax }, (_, i) => i + 1)
}

export type GapSeverity = 'aligned' | 'minor' | 'significant'

export interface ScoreGap {
  /** mentor − self; negative means the student rated themselves higher. */
  value: number
  severity: GapSeverity
}

/** Signed self↔mentor gap with a severity bucket proportional to the scale. */
export function scoreGap(
  self: number,
  mentor: number,
  scaleMax: number
): ScoreGap {
  const value = mentor - self
  const magnitude = Math.abs(value) / scaleMax
  const severity: GapSeverity =
    magnitude === 0 ? 'aligned' : magnitude <= 0.2 ? 'minor' : 'significant'
  return { value, severity }
}

/** Compact score display, e.g. `4/5`. Pair with the mono font for data. */
export function formatScore(score: number, scaleMax: number): string {
  return `${score}/${scaleMax}`
}

/** 0–100 percentage of the scale, for progress bars. */
export function scorePercent(score: number, scaleMax: number): number {
  if (scaleMax <= 0) return 0
  return Math.round((score / scaleMax) * 100)
}
