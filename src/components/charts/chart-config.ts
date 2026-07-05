/**
 * Shared chart constants. Colors come from the validated `--chart-*` tokens
 * (see globals.css) so light/dark each use their own vetted palette.
 *
 * Fixed series-role assignment (never cycled): self = navy, mentor = emerald,
 * agreed = gold. Historical overlays use the de-emphasis treatment (muted,
 * thin) rather than new hues.
 */
export const SERIES_COLORS = {
  self: 'var(--chart-1)',
  mentor: 'var(--chart-2)',
  agreed: 'var(--chart-3)',
  extra1: 'var(--chart-4)',
  extra2: 'var(--chart-5)',
} as const

export const CHART_TEXT = {
  primary: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
} as const

export const GRID_STROKE = 'var(--border)'

/** Recharts font sizing for axis ticks/labels. */
export const TICK_STYLE = {
  fontSize: 12,
  fill: 'var(--muted-foreground)',
} as const
