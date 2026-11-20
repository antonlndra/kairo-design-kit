'use client'

import { Area, AreaChart, XAxis, YAxis } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { cx } from '@/utils/cx'

export type RevenuePoint = {
  date: string
  value: number
}

type RevenueLineChartProps = {
  data?: RevenuePoint[]
  theme?: 'light' | 'dark'
  className?: string
  label?: string
}

const FALLBACK: RevenuePoint[] = [
  { date: 'Lun', value: 42 },
  { date: 'Mar', value: 58 },
  { date: 'Mié', value: 51 },
  { date: 'Jue', value: 73 },
  { date: 'Vie', value: 66 },
  { date: 'Sáb', value: 48 },
  { date: 'Dom', value: 61 },
]

const BRAND = 'var(--chart-brand)'
const BRAND_SOFT = 'var(--chart-brand-soft)'

/** Tendencia agregada — azul glossy (accent), no morado. */
export function RevenueLineChart({
  data = FALLBACK,
  theme: _theme = 'light',
  className,
  label = 'Rendimiento',
}: RevenueLineChartProps) {
  void _theme
  return (
    <div
      className={cx(
        'depth-surface overflow-hidden rounded-3xl p-4',
        className,
      )}
    >
      <p className="text-caption-1-semibold uppercase tracking-wide text-text-tertiary">{label}</p>
      <ChartContainer
        className="mt-3 h-48 w-full aspect-auto"
        config={{ value: { label, color: BRAND } }}
      >
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BRAND_SOFT} stopOpacity={0.4} />
              <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'currentColor', fontSize: 11 }}
            className="text-text-tertiary"
          />
          <YAxis hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={BRAND}
            strokeWidth={2}
            fill="url(#revenue-fill)"
            fillOpacity={1}
            isAnimationActive
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
