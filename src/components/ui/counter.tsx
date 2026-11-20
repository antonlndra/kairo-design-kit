import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cx } from '@/utils/cx'

type CounterProps = {
  value: number
  /** Optional formatted display when animation finishes / reduced motion */
  format?: (n: number) => string
  className?: string
  durationMs?: number
}

/** Cuenta animada hacia el valor (respeta prefers-reduced-motion). */
export function Counter({
  value,
  format = (n) => String(Math.round(n)),
  className,
  durationMs = 900,
}: CounterProps) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = React.useState(reduce ? value : 0)

  React.useEffect(() => {
    if (reduce) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const from = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs, reduce])

  return (
    <motion.span
      className={cx('inline-block tabular-nums', className)}
      initial={reduce ? false : { opacity: 0.4, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {format(display)}
    </motion.span>
  )
}

export default Counter
