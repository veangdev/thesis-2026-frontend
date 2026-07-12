'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { scaleTicks } from '@/lib/scoring'
import { SERIES_COLORS, TICK_STYLE } from './chart-config'
import { ChartTooltip } from './chart-tooltip'

export interface GrowthLineSeries {
  key: string
  label: string
  color?: string
}

export interface GrowthLineDatum {
  label: string
  [seriesKey: string]: string | number | null
}

interface GrowthLineProps {
  data: GrowthLineDatum[]
  series: GrowthLineSeries[]
  /** When provided, the y-axis is a score axis derived from the scale. */
  scaleMax?: number
  height?: number
  className?: string
}

const DEFAULT_COLORS = [
  SERIES_COLORS.self,
  SERIES_COLORS.mentor,
  SERIES_COLORS.agreed,
  SERIES_COLORS.extra1,
  SERIES_COLORS.extra2,
]

/** Growth-over-cycles line chart (2px lines, ringed markers, hairline grid). */
export function GrowthLine({
  data,
  series,
  scaleMax,
  height = 260,
  className,
}: GrowthLineProps) {
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 0, left: -16 }}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeWidth={1}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            domain={scaleMax ? [0, scaleMax] : undefined}
            ticks={scaleMax ? scaleTicks(scaleMax) : undefined}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<ChartTooltip />} />
          {series.length > 1 && (
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {series.map((entry, index) => {
            const color =
              entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]
            return (
              <Line
                key={entry.key}
                name={entry.label}
                dataKey={entry.key}
                type="monotone"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                connectNulls
                dot={{
                  r: 4,
                  fill: color,
                  stroke: 'var(--background)',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  stroke: 'var(--background)',
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
