'use client'

import { Bar, BarChart, XAxis, YAxis, Legend } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { cx } from '@/utils/cx'

export type StackedWeek = {
  label: string
  planned: number
  posted: number
  interactions?: number
}

type DitherStackedChartProps = {
  data?: StackedWeek[]
  theme?: 'light' | 'dark'
  className?: string
}

const FALLBACK: StackedWeek[] = [
  { label: 'S-3', planned: 21, posted: 10 },
  { label: 'S-2', planned: 21, posted: 14 },
  { label: 'S-1', planned: 21, posted: 16 },
  { label: 'Esta', planned: 21, posted: 12 },
]

const BRAND = 'var(--chart-brand)'
const MUTED = 'var(--chart-brand-muted)'

/** Un bloque por semana: planificado vs publicado — azul glossy. */
export function DitherStackedChart({
  data = FALLBACK,
  theme: _theme = 'light',
  className,
}: DitherStackedChartProps) {
  void _theme

  return (
    <div
      className={cx(
        'depth-surface overflow-hidden rounded-3xl p-4',
        className,
      )}
    >
      <p className="text-caption-1-semibold uppercase tracking-wide text-text-tertiary">
        Semanas del plan
      </p>
      <ChartContainer
        className="mt-3 h-44 w-full aspect-auto"
        config={{
          planned: { label: 'Planificado', color: MUTED },
          posted: { label: 'Publicado', color: BRAND },
        }}
      >
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="28%">
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'currentColor', fontSize: 11 }}
            className="text-text-tertiary"
          />
          <YAxis hide />
          <Legend
            verticalAlign="top"
            height={24}
            formatter={(v) => <span className="text-caption-1-regular text-text-secondary">{v}</span>}
          />
          <Bar dataKey="planned" name="Planificado" fill={MUTED} radius={[6, 6, 0, 0]} />
          <Bar dataKey="posted" name="Publicado" fill={BRAND} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
