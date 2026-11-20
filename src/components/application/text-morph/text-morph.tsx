'use client'

import { TextMorph as TorphTextMorph, type TextMorphProps } from 'torph/react'
import { cx } from '@/utils/cx'

const DEFAULT_EASE = { stiffness: 220, damping: 24, mass: 1 } as const

/**
 * BoardUI-friendly wrapper around torph TextMorph.
 * Use for state-changing labels (week, like/dislike, busy), not page entrances.
 */
export function TextMorph({
  className,
  duration = 380,
  ease = DEFAULT_EASE,
  locale = 'es',
  respectReducedMotion = true,
  as = 'span',
  ...props
}: TextMorphProps) {
  return (
    <TorphTextMorph
      as={as}
      className={cx('relative', className)}
      duration={duration}
      ease={ease}
      locale={locale}
      respectReducedMotion={respectReducedMotion}
      {...props}
    />
  )
}
