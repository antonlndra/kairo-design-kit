import { motion, useReducedMotion } from 'framer-motion'
import { cx } from '@/utils/cx'

type PulsatingDotsProps = {
  className?: string
  /** Smaller dots for inline status */
  size?: 'sm' | 'md'
}

export function PulsatingDots({ className, size = 'md' }: PulsatingDotsProps) {
  const reduce = useReducedMotion()
  const dot = size === 'sm' ? 'size-1.5' : 'size-2.5'

  return (
    <div className={cx('flex items-center gap-1', className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cx('rounded-full bg-accent-500', dot)}
          animate={
            reduce
              ? { opacity: 0.7 }
              : { scale: [1, 1.35, 1], opacity: [0.45, 1, 0.45] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.15, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }
          }
        />
      ))}
    </div>
  )
}

export default PulsatingDots
