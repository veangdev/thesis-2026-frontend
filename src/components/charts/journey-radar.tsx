'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { scaleTicks } from '@/lib/scoring'
import { SERIES_COLORS, TICK_STYLE } from './chart-config'
import { ChartTooltip } from './chart-tooltip'

export interface RadarSeries {
  key: string
  label: string
  color?: string
  /** De-emphasized rendering for historical overlays. */
  muted?: boolean
}

export interface RadarDatum {
  dimension: string
  /** One numeric value per series key. */
  [seriesKey: string]: string | number | null
}

interface JourneyRadarProps {
  data: RadarDatum[]
  series: RadarSeries[]
  /** Cohort's scoringScaleMax — axis domain derives from it (never hard-coded). */
  scaleMax: number
  height?: number
  className?: string
}

const DEFAULT_SERIES_COLORS = [
  SERIES_COLORS.self,
  SERIES_COLORS.mentor,
  SERIES_COLORS.agreed,
  SERIES_COLORS.extra1,
  SERIES_COLORS.extra2,
]

/**
 * The Journey Star — radar over the cohort's dimensions. Axis domain and
 * ticks derive from `scaleMax`, so switching a cohort 5 ↔ 10 visibly
 * rescales the chart (spec §7).
 */
export function JourneyRadar({
  data,
  series,
  scaleMax,
  height = 320,
  className,
}: JourneyRadarProps) {
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="dimension" tick={TICK_STYLE} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, scaleMax]}
            ticks={scaleTicks(scaleMax)}
            tick={{ ...TICK_STYLE, fontSize: 10 }}
            stroke="var(--border)"
            axisLine={false}
          />
          {series.map((entry, index) => {
            const color =
              entry.color ??
              DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length]
            return (
              <Radar
                key={entry.key}
                name={entry.label}
                dataKey={entry.key}
                stroke={color}
                fill={color}
                fillOpacity={entry.muted ? 0.04 : 0.1}
                strokeWidth={entry.muted ? 1 : 2}
                strokeOpacity={entry.muted ? 0.45 : 1}
                dot={
                  entry.muted
                    ? false
                    : {
                        r: 3,
                        fill: color,
                        stroke: 'var(--background)',
                        strokeWidth: 2,
                      }
                }
                isAnimationActive={false}
              />
            )
          })}
          <Tooltip content={<ChartTooltip />} />
          {series.length > 1 && (
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="circle"
              iconSize={8}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
