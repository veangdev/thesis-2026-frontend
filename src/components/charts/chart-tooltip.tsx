'use client'

type TooltipEntry = {
  name?: string | number
  value?: number | string | Array<number | string>
  color?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<TooltipEntry>
  label?: string | number
}

/**
 * Shared Recharts tooltip: surface background, hairline border, text tokens
 * for all copy, and a colored swatch (never colored text) for identity.
 * Prop shape matches what Recharts injects into a Tooltip `content` element.
 */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
      {label !== undefined && label !== '' && (
        <p className="mb-1.5 font-medium">{String(label)}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div
            key={`${String(entry.name)}-${index}`}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {String(entry.name)}
              </span>
            </span>
            <span className="font-mono font-medium tabular-nums">
              {Array.isArray(entry.value)
                ? entry.value.join(' – ')
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
