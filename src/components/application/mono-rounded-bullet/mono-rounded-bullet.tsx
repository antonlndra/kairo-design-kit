import { cx } from '@/utils/cx'

export type BulletItem = {
  title: string
  /** 0–100, comparado con `target` (umbral, p. ej. 70) */
  actual: number
  target: number
  note?: string
}

export type MonoRoundedBulletProps = {
  items: BulletItem[]
  heading?: string
  className?: string
}

export function MonoRoundedBullet({
  items,
  heading = 'Rúbrica',
  className,
}: MonoRoundedBulletProps) {
  return (
    <div
      className={cx(
        'depth-surface relative flex w-full flex-col gap-3 rounded-3xl border-0 p-4 sm:p-5',
        className,
      )}
    >
      <p className="text-caption-1-semibold uppercase tracking-wider text-text-tertiary">
        {heading}
      </p>

      <div className="flex w-full flex-col gap-4 rounded-2xl bg-background-secondary-default p-3">
        {items.map((item) => {
          const actual = Math.max(0, Math.min(100, item.actual))
          const target = Math.max(0, Math.min(100, item.target))
          const pass = actual >= target
          return (
            <div key={item.title} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-body-2-medium text-text-primary">{item.title}</span>
                <span
                  className={cx(
                    'shrink-0 text-caption-1-semibold tabular-nums',
                    pass ? 'text-accent-700' : 'text-text-error-primary',
                  )}
                >
                  {pass ? 'cumple' : 'falla'}
                </span>
              </div>
              <div className="relative h-3 w-full rounded-full bg-accent-100">
                <div
                  className={cx(
                    'h-full rounded-full transition-all duration-[var(--duration-slow)] ease-[var(--ease-smooth-out)]',
                    pass ? 'bg-accent-500' : 'bg-accent-300',
                  )}
                  style={{ width: `${actual}%` }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-primary"
                  style={{ left: `${target}%` }}
                  aria-hidden
                />
              </div>
              {item.note ? (
                <p className="text-caption-1-regular text-text-secondary">{item.note}</p>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
