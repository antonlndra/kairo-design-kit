import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { cx } from '@/utils/cx'
import { NumberPop } from '@/components/application/number-pop/number-pop'

export type MonoRoundedGaugeArcProps = {
  /** 0–10 score from Analizar */
  score: number
  max?: number
  label?: string
  className?: string
}

export function MonoRoundedGaugeArc({
  score,
  max = 10,
  label = 'Nota',
  className,
}: MonoRoundedGaugeArcProps) {
  const clamped = Math.max(0, Math.min(max, score))
  const pct = Math.round((clamped / max) * 100)
  const data = [
    { name: 'Active', value: pct },
    { name: 'Remaining', value: Math.max(0, 100 - pct) },
  ]

  return (
    <div
      className={cx(
        'depth-surface relative flex min-h-[240px] w-full flex-col gap-3 overflow-hidden rounded-3xl border-0 p-4 sm:p-5',
        className,
      )}
    >
      <div>
        <p className="text-caption-1-semibold uppercase tracking-wider text-text-tertiary">
          {label}
        </p>
        <p className="mt-0.5 font-sans text-title-3-semibold tabular-nums text-text-primary">
          <NumberPop value={pct} />
          <span className="text-caption-1-regular font-normal text-text-secondary">%</span>
        </p>
      </div>

      <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl bg-background-secondary-default p-2">
        <ResponsiveContainer width="100%" height={148}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="58%"
              startAngle={210}
              endAngle={-30}
              innerRadius={54}
              outerRadius={72}
              cornerRadius={8}
              strokeLinecap="round"
              paddingAngle={pct > 0 && pct < 100 ? 4 : 0}
              isAnimationActive={false}
            >
              <Cell fill="var(--color-accent-500)" />
              <Cell fill="color-mix(in oklab, var(--color-accent-500) 12%, transparent)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center">
          <span className="font-sans text-title-2-medium tabular-nums text-text-primary">
            <NumberPop value={clamped.toFixed(1)} />
          </span>
          <span className="text-caption-1-regular text-text-tertiary">/ {max}</span>
        </div>
      </div>
    </div>
  )
}
