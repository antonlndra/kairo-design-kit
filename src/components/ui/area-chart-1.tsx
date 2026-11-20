import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  AreaChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  AreaSeries,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline,
} from 'reaviz'
import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react'
import { cx } from '@/utils/cx'

export type AreaChartPoint = {
  key: Date
  data: number
}

export type AreaChartSeries = {
  key: string
  data: AreaChartPoint[]
}

export type AreaChartMetric = {
  id: string
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  /** up = good when positive metrics; use invert for "bad if up" */
  goodWhen?: 'up' | 'down'
}

type AreaChart1Props = {
  title?: string
  legend?: Array<{ name: string; colorVar: string }>
  series?: AreaChartSeries[]
  metrics?: AreaChartMetric[]
  className?: string
  height?: number
}

const DEFAULT_LEGEND = [
  { name: 'Publicados', colorVar: 'var(--chart-brand-deep)' },
  { name: 'Planificados', colorVar: 'var(--chart-brand-soft)' },
  { name: 'Interacciones', colorVar: 'var(--chart-brand-muted)' },
]

function daysAgo(n: number): Date {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return d
}

const DEFAULT_SERIES: AreaChartSeries[] = [
  {
    key: 'Publicados',
    data: [6, 5, 4, 3, 2, 1, 0].map((o, i) => ({
      key: daysAgo(o),
      data: [2, 3, 2, 4, 3, 5, 4][i]!,
    })),
  },
  {
    key: 'Planificados',
    data: [6, 5, 4, 3, 2, 1, 0].map((o, i) => ({
      key: daysAgo(o),
      data: [3, 3, 3, 3, 3, 3, 3][i]!,
    })),
  },
  {
    key: 'Interacciones',
    data: [6, 5, 4, 3, 2, 1, 0].map((o, i) => ({
      key: daysAgo(o),
      data: [8, 12, 10, 16, 14, 20, 18][i]!,
    })),
  },
]

const DEFAULT_METRICS: AreaChartMetric[] = [
  {
    id: 'posted',
    label: 'Posted esta semana',
    value: '12',
    trend: 'up',
    goodWhen: 'up',
  },
  {
    id: 'planned',
    label: 'Plan vs posted',
    value: '57%',
    trend: 'up',
    goodWhen: 'up',
  },
  {
    id: 'drafts',
    label: 'Drafts en cola',
    value: '4',
    trend: 'down',
    goodWhen: 'down',
  },
]

function TrendBadge({
  trend,
  goodWhen = 'up',
}: {
  trend: AreaChartMetric['trend']
  goodWhen?: 'up' | 'down'
}) {
  if (trend === 'neutral') return null
  const good = trend === goodWhen
  return (
    <span
      className={cx(
        'inline-flex size-7 items-center justify-center rounded-full',
        good ? 'bg-accent-50 text-accent-700' : 'bg-background-tertiary-default text-text-error-primary',
      )}
    >
      {trend === 'up' ? (
        <RiArrowUpLine className="size-4" />
      ) : (
        <RiArrowDownLine className="size-4" />
      )}
    </span>
  )
}

/** Card de tendencia multi-serie (reaviz) — tokens BoardUI, métricas Kairo. */
export function AreaChart1({
  title = 'Pulso de la semana',
  legend = DEFAULT_LEGEND,
  series = DEFAULT_SERIES,
  metrics = DEFAULT_METRICS,
  className,
  height = 200,
}: AreaChart1Props) {
  const reduce = useReducedMotion()
  const colorScheme = legend.map((l) => l.colorVar)

  const chartData = React.useMemo(
    () =>
      series.map((s) => ({
        key: s.key,
        data: s.data.map((p) => ({
          key: p.key,
          data: Number.isFinite(p.data) ? p.data : 0,
        })),
      })),
    [series],
  )

  return (
    <div
      className={cx(
        'depth-surface flex w-full flex-col overflow-hidden rounded-3xl bg-background-primary-default',
        className,
      )}
    >
      <h3 className="px-6 pt-6 text-title-3-semibold text-text-primary">{title}</h3>

      <div className="mt-4 flex flex-wrap justify-between gap-2 px-6">
        {legend.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-3.5 shrink-0 rounded-sm"
              style={{ backgroundColor: item.colorVar }}
              aria-hidden
            />
            <span className="text-caption-1-semibold text-text-tertiary">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="reaviz-chart-container mt-2 px-2" style={{ height }}>
        <AreaChart
          height={height}
          id="kairo-area-week"
          data={chartData}
          xAxis={
            <LinearXAxis
              type="time"
              tickSeries={
                <LinearXAxisTickSeries
                  label={
                    <LinearXAxisTickLabel
                      format={(v) =>
                        new Date(v as Date | string | number).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'numeric',
                        })
                      }
                      fill="var(--reaviz-tick-fill)"
                    />
                  }
                  tickSize={10}
                />
              }
            />
          }
          yAxis={
            <LinearYAxis
              axisLine={null}
              tickSeries={<LinearYAxisTickSeries line={null} label={null} tickSize={10} />}
            />
          }
          series={
            <AreaSeries
              type="grouped"
              interpolation="smooth"
              area={
                <Area
                  gradient={
                    <Gradient
                      stops={[
                        <GradientStop key="a" stopOpacity={0} />,
                        <GradientStop key="b" offset="100%" stopOpacity={0.35} />,
                      ]}
                    />
                  }
                />
              }
              colorScheme={colorScheme}
            />
          }
          gridlines={
            <GridlineSeries line={<Gridline strokeColor="var(--reaviz-gridline-stroke)" />} />
          }
        />
      </div>

      <div className="mt-2 flex flex-col divide-y divide-separator-border px-6 pb-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : i * 0.06 }}
            className="flex w-full items-center gap-2 py-3"
          >
            <span className="w-1/2 truncate text-body-regular text-text-secondary" title={metric.label}>
              {metric.label}
            </span>
            <div className="flex w-1/2 items-center justify-end gap-2">
              <span className="text-headline-medium tabular-nums text-text-primary">
                {metric.value}
              </span>
              <TrendBadge trend={metric.trend} goodWhen={metric.goodWhen} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AreaChart1
