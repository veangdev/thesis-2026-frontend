import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Score/zone helpers live in `src/lib/scoring.ts` — they must derive from the
// cohort's configurable scoringScaleMax, so there are no fixed-scale versions.

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
