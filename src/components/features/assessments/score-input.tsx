'use client'

import { Star } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { getZone, scoreValues, zoneCssVar, zoneLabel } from '@/lib/scoring'
import { cn } from '@/lib/utils'

interface ScoreInputProps {
  value: number | null
  onChange: (value: number) => void
  /** Cohort's scoringScaleMax — picks the control and its range. */
  scaleMax: number
  disabled?: boolean
  /** Accessible name for the group, e.g. the dimension name. */
  label: string
}

/**
 * Scale-aware score input (spec §6): star rating for compact scales (≤5),
 * slider with tick labels for wide ones (10). Both derive everything from
 * `scaleMax` and show the growth zone of the current value.
 */
export function ScoreInput({
  value,
  onChange,
  scaleMax,
  disabled,
  label,
}: ScoreInputProps) {
  const zone = value !== null ? getZone(value, scaleMax) : null

  return (
    <div className="space-y-2">
      {scaleMax <= 5 ? (
        <div
          role="radiogroup"
          aria-label={`${label} score`}
          className="flex items-center gap-1"
        >
          {scoreValues(scaleMax).map((candidate) => {
            const active = value !== null && candidate <= value
            return (
              <button
                key={candidate}
                type="button"
                role="radio"
                aria-checked={value === candidate}
                aria-label={`${candidate} of ${scaleMax}`}
                disabled={disabled}
                onClick={() => onChange(candidate)}
                className={cn(
                  'focus-visible:ring-ring/50 rounded-md p-1 transition-transform focus-visible:ring-[3px] focus-visible:outline-none',
                  !disabled && 'hover:scale-110'
                )}
              >
                <Star
                  className={cn(
                    'size-7',
                    active
                      ? 'fill-brand-gold text-brand-gold'
                      : 'text-muted-foreground/40'
                  )}
                />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-1.5 pt-1">
          <Slider
            value={[value ?? 0]}
            onValueChange={([next]) => next >= 1 && onChange(next)}
            min={0}
            max={scaleMax}
            step={1}
            disabled={disabled}
            aria-label={`${label} score`}
          />
          <div className="text-muted-foreground flex justify-between font-mono text-[10px]">
            {scoreValues(scaleMax).map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
        </div>
      )}

      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        {value !== null && zone ? (
          <>
            <span className="font-mono font-medium tabular-nums">
              {value}/{scaleMax}
            </span>
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: zoneCssVar(zone) }}
            />
            {zoneLabel(zone)}
          </>
        ) : (
          'Not scored yet'
        )}
      </p>
    </div>
  )
}
