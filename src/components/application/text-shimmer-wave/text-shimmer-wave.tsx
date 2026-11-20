import { motion } from 'motion/react'
import { cx } from '@/utils/cx'

export type TextShimmerWaveProps = {
  text?: string
  className?: string
}

export function TextShimmerWave({ text = 'Thinking', className }: TextShimmerWaveProps) {
  return (
    <div
      className={cx('flex text-body-medium text-text-primary', className)}
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className={cx('inline-block', char === ' ' && 'w-[0.3em]')}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        >
          {char === ' ' ? '\u00a0' : char}
        </motion.span>
      ))}
    </div>
  )
}
