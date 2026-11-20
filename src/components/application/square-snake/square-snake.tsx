import { motion } from 'motion/react'
import { cx } from '@/utils/cx'

export type SquareSnakeProps = {
  className?: string
  size?: 'sm' | 'md'
}

const CELLS: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
]

export function SquareSnake({ className, size = 'sm' }: SquareSnakeProps) {
  return (
    <div
      className={cx(
        'grid grid-cols-3 gap-0.5',
        size === 'sm' ? 'size-3.5' : 'size-10',
        className,
      )}
      role="status"
      aria-label="Cargando"
    >
      {CELLS.map(([x, y], i) => (
        <motion.div
          key={i}
          className="size-full rounded-[1px] bg-accent-700"
          animate={{ opacity: [0.12, 1, 0.12] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: (x + y) * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
      <span className="sr-only">Cargando</span>
    </div>
  )
}
