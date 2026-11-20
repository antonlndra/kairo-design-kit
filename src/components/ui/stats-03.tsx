import { Card, CardContent } from '@/components/ui/card'
import { cx } from '@/utils/cx'
import { Counter } from '@/components/ui/counter'

export type Stats03Item = {
  name: string
  /** Display string, or number for Counter animation */
  stat: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  /** When true and stat is number, animate with Counter */
  animate?: boolean
}

type Stats03Props = {
  items: Stats03Item[]
  className?: string
}

export function Stats03({ items, className }: Stats03Props) {
  return (
    <div className={cx('grid grid-cols-2 gap-3 md:grid-cols-4', className)}>
      {items.map((item) => (
        <Card
          key={item.name}
          className="depth-surface rounded-3xl border-0 bg-transparent shadow-none"
        >
          <CardContent className="p-4">
            <p className="text-caption-1-semibold text-text-tertiary">{item.name}</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              {item.animate && typeof item.stat === 'number' ? (
                <Counter
                  value={item.stat}
                  className="text-title-2-medium tabular-nums text-text-primary"
                />
              ) : (
                <span className="text-title-2-medium tabular-nums text-text-primary">
                  {item.stat}
                </span>
              )}
              {item.change != null && item.change !== '' && (
                <span
                  className={cx(
                    'text-caption-1-semibold tabular-nums',
                    item.changeType === 'positive' && 'text-accent-700',
                    item.changeType === 'negative' && 'text-text-error-primary',
                    (item.changeType === 'neutral' || !item.changeType) &&
                      'text-text-tertiary',
                  )}
                >
                  {item.change}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Stats03
