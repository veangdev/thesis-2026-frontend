import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SCORE_ZONES, type ScoreZone } from '@/constants/app'

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Map a 1–10 score to its zone key. Returns null when there is no score. */
export function getScoreZone(score: number | null): ScoreZone | null {
  if (score === null) return null
  if (score <= SCORE_ZONES.STRUGGLING.max) return 'STRUGGLING'
  if (score <= SCORE_ZONES.DEVELOPING.max) return 'DEVELOPING'
  return 'THRIVING'
}

/** Human-readable zone label for a score (e.g. "Thriving"). */
export function getScoreLabel(score: number | null): string {
  const zone = getScoreZone(score)
  return zone ? SCORE_ZONES[zone].label : '—'
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function calcAverage(scores: number[]): number {
  if (!scores.length) return 0
  const total = scores.reduce((sum, value) => sum + value, 0)
  return Math.round((total / scores.length) * 10) / 10
}
