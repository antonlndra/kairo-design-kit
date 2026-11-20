import * as React from 'react'
import { cx } from '@/utils/cx'

export type NumberPopProps = {
  value: string | number
  className?: string
}

export function NumberPop({ value, className }: NumberPopProps) {
  const str = String(value)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove('is-animating')
    void el.offsetHeight
    el.classList.add('is-animating')
  }, [str])

  const chars = str.split('')

  return (
    <span ref={ref} className={cx('t-digit-group is-animating', className)}>
      {chars.map((ch, i) => {
        const fromEnd = chars.length - 1 - i
        const stagger = fromEnd === 0 ? '2' : fromEnd === 1 ? '1' : undefined
        return (
          <span key={`${ch}-${i}`} className="t-digit" data-stagger={stagger}>
            {ch}
          </span>
        )
      })}
    </span>
  )
}
