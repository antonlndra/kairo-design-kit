'use client'

import { cx } from '@/utils/cx'

export type HeatCell = {
  day: number
  hour: number
  value: number
}

type ActivityHeatmapProps = {
  cells?: HeatCell[]
  theme?: 'light' | 'dark'
  className?: string
  peakHour?: number
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const HOUR_TICKS = [0, 6, 9, 12, 15, 18, 21]

function defaultCells(): HeatCell[] {
  const out: HeatCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const peak = hour === 9 || hour === 12 || hour === 18
      out.push({
        day,
        hour,
        value: peak ? 6 + (day % 3) : hour >= 8 && hour <= 20 ? 1 + ((day + hour) % 3) : 0,
      })
    }
  }
  return out
}

/** Heatmap 7×24 — intensidad con azul glossy (accent). */
export function ActivityHeatmap({
  cells,
  theme: _theme = 'light',
  className,
  peakHour,
}: ActivityHeatmapProps) {
  void _theme
  const data = cells?.length ? cells : defaultCells()
  const max = Math.max(1, ...data.map((c) => c.value))
  const grid = new Map(data.map((c) => [`${c.day}-${c.hour}`, c.value]))

  return (
    <div
      className={cx(
        'depth-surface overflow-hidden rounded-3xl p-4',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-caption-1-semibold uppercase tracking-wide text-text-tertiary">
          Mejores horas
        </p>
        {peakHour != null ? (
          <p className="text-caption-1-regular text-text-secondary tabular-nums">
            Pico · {String(peakHour).padStart(2, '0')}:00
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex gap-2">
        <div className="flex w-4 flex-col justify-between py-0.5 text-[10px] text-text-tertiary">
          {DAY_LABELS.map((d) => (
            <span key={d} className="leading-none">
              {d}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="grid gap-0.5"
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, 10px)' }}
          >
            {Array.from({ length: 7 }, (_, day) =>
              Array.from({ length: 24 }, (_, hour) => {
                const value = grid.get(`${day}-${hour}`) ?? 0
                const t = value / max
                return (
                  <div
                    key={`${day}-${hour}`}
                    title={`${DAY_LABELS[day]} ${String(hour).padStart(2, '0')}:00 · ${value}`}
                    className="rounded-[2px] bg-background-secondary-default"
                    style={
                      t > 0
                        ? {
                            backgroundColor: `color-mix(in oklab, var(--chart-brand) ${Math.round(t * 100)}%, transparent)`,
                          }
                        : undefined
                    }
                  />
                )
              }),
            )}
          </div>
          <div className="mt-1 flex justify-between text-[10px] tabular-nums text-text-tertiary">
            {HOUR_TICKS.map((h) => (
              <span key={h}>{String(h).padStart(2, '0')}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
