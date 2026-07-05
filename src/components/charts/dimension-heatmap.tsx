'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatScore } from '@/lib/scoring'
import { cn } from '@/lib/utils'

export interface HeatmapColumn {
  id: string
  label: string
}

export interface HeatmapRow {
  id: string
  label: string
  /** Value per column id; null renders an empty cell. */
  values: Record<string, number | null>
}

interface DimensionHeatmapProps {
  columns: HeatmapColumn[]
  rows: HeatmapRow[]
  scaleMax: number
  /** Called when a row label is clicked (e.g. open the student). */
  onRowClick?: (rowId: string) => void
  className?: string
}

/**
 * CSS-grid heatmap (students × dimensions). Magnitude uses a single-hue
 * sequential wash of chart-1 — light→dark tracks low→high (color-mix with the
 * card surface). Values are readable in the cell tooltip and the row average.
 */
export function DimensionHeatmap({
  columns,
  rows,
  scaleMax,
  onRowClick,
  className,
}: DimensionHeatmapProps) {
  const cellBackground = (value: number | null) => {
    if (value === null) return 'transparent'
    const strength = Math.round(12 + (value / scaleMax) * 72)
    return `color-mix(in oklab, var(--chart-1) ${strength}%, var(--card))`
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div
        className="grid min-w-[640px] items-stretch gap-0.5 text-xs"
        style={{
          gridTemplateColumns: `minmax(140px, 1.4fr) repeat(${columns.length}, minmax(48px, 1fr))`,
        }}
      >
        <div />
        {columns.map((column) => (
          <div
            key={column.id}
            className="text-muted-foreground truncate px-1 pb-2 text-center font-medium"
            title={column.label}
          >
            {column.label.length > 10
              ? `${column.label.slice(0, 9)}…`
              : column.label}
          </div>
        ))}

        {rows.map((row) => (
          <div key={row.id} className="contents">
            <button
              type="button"
              onClick={onRowClick ? () => onRowClick(row.id) : undefined}
              className={cn(
                'truncate py-1.5 pr-3 text-left font-medium',
                onRowClick && 'hover:text-primary hover:underline'
              )}
            >
              {row.label}
            </button>
            {columns.map((column) => {
              const value = row.values[column.id] ?? null
              const strong = value !== null && value / scaleMax > 0.55
              return (
                <Tooltip key={column.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'flex min-h-8 items-center justify-center rounded-sm font-mono tabular-nums',
                        value === null && 'bg-muted/40 text-muted-foreground',
                        strong ? 'text-white' : 'text-foreground'
                      )}
                      style={{ backgroundColor: cellBackground(value) }}
                    >
                      {value ?? '–'}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {row.label} · {column.label}:{' '}
                    {value === null
                      ? 'not assessed'
                      : formatScore(value, scaleMax)}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
