'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Transition } from 'motion/react'
import {
  RiCake2Line,
  RiHeartLine,
  RiNotification3Line,
  RiPlaneLine,
  RiShoppingCart2Line,
  RiSunLine,
  RiChat3Line,
  RiSparklingLine,
} from '@remixicon/react'
import {
  CalendarGlassCard,
  type CalendarGlassCardProps,
  type CalendarGlassTone,
} from '@/components/application/calendar-glass-card/calendar-glass-card'
import { cx } from '@/utils/cx'

export type FanCardItem = {
  id: string
  title: string
  meta: string
  tone: CalendarGlassTone
  icon?: CalendarGlassCardProps['icon']
}

export type CalendarCardFanProps = {
  items: FanCardItem[]
  /** Radius of the expanded ring in px. */
  radius?: number
  className?: string
  onSelect?: (id: string) => void
  /** Controlled open. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Uncontrolled start. */
  defaultOpen?: boolean
  /** Stay open (lab burst demo). */
  lockedOpen?: boolean
  /**
   * `hover` — open on pointer enter (marketing).
   * `click` — tap stack to fan, tap again / outside to close (calendar).
   */
  trigger?: 'hover' | 'click'
  /** Smaller footprint for day columns. */
  compact?: boolean
}

const springSettle: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.4,
}

const springFan: Transition = {
  type: 'spring',
  bounce: 0.18,
  duration: 0.45,
}

function polar(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const deg = (angle * 180) / Math.PI
  const rotate = Math.max(-28, Math.min(28, deg * 0.35))
  return { x, y, rotate }
}

function stackOffset(index: number, total: number) {
  const mid = (total - 1) / 2
  const t = index - mid
  return {
    x: t * 10,
    y: Math.abs(t) * 4,
    rotate: t * 6,
  }
}

/**
 * Same-day stack → radial fan. Pick a card once fanned.
 */
export function CalendarCardFan({
  items,
  radius,
  className,
  onSelect,
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  lockedOpen = false,
  trigger = 'hover',
  compact = false,
}: CalendarCardFanProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const isControlled = openProp !== undefined
  const hoverOpen = isControlled ? openProp : uncontrolled
  const open = lockedOpen || hoverOpen
  const list = items.slice(0, 8)
  const ring = radius ?? (compact ? 108 : 132)
  const cardW = compact ? 10.5 : 11.5
  const cardH = compact ? 6.5 : 7.25

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (lockedOpen) return
      if (!isControlled) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [isControlled, lockedOpen, onOpenChange],
  )

  React.useEffect(() => {
    if (trigger !== 'click' || lockedOpen || !open) return
    const onDoc = (e: PointerEvent) => {
      const el = rootRef.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [trigger, lockedOpen, open, setOpen])

  if (list.length === 0) return null

  // Single card — no fan needed
  if (list.length === 1) {
    const only = list[0]
    return (
      <div className={cx('relative flex justify-center', className)}>
        <button
          type="button"
          className="rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          onClick={() => onSelect?.(only.id)}
        >
          <CalendarGlassCard
            title={only.title}
            meta={only.meta}
            tone={only.tone}
            icon={only.icon}
            elevated
            className={compact ? 'h-auto min-h-[6.5rem] w-[10.5rem]' : undefined}
          />
        </button>
      </div>
    )
  }

  const transition = reduceMotion ? { duration: 0 } : open ? springFan : springSettle
  const box = compact ? 'size-[20rem] sm:size-[22rem]' : 'size-[28rem] sm:size-[32rem]'

  return (
    <div
      ref={rootRef}
      className={cx(
        'relative mx-auto flex max-w-full items-center justify-center',
        box,
        className,
      )}
      onPointerEnter={() => {
        if (trigger === 'hover') setOpen(true)
      }}
      onPointerLeave={() => {
        if (trigger === 'hover') setOpen(false)
      }}
      onFocusCapture={() => {
        if (trigger === 'hover') setOpen(true)
      }}
      onBlurCapture={(e) => {
        if (trigger !== 'hover') return
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-36 rounded-full bg-accent-200/40 blur-3xl sm:size-40"
        animate={{ opacity: open ? 0.9 : 0.35, scale: open ? 1.15 : 0.85 }}
        transition={transition}
      />

      {!open && trigger === 'click' ? (
        <button
          type="button"
          aria-expanded={false}
          aria-label={`Abrir stack de ${list.length} tweets`}
          className="absolute inset-0 z-20 cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          onClick={() => setOpen(true)}
        />
      ) : null}

      <ul className="relative size-full list-none p-0" role="list">
        {list.map((item, i) => {
          const stacked = stackOffset(i, list.length)
          const fanned = polar(i, list.length, ring)
          const pose = open ? fanned : stacked

          return (
            <motion.li
              key={item.id}
              className="absolute left-1/2 top-1/2"
              style={{
                zIndex: open ? i + 1 : list.length - i,
                marginLeft: `-${cardW / 2}rem`,
                marginTop: `-${cardH / 2}rem`,
              }}
              initial={false}
              animate={{
                x: pose.x,
                y: pose.y,
                rotate: pose.rotate,
                scale: open ? 1 : 0.92 - i * 0.015,
              }}
              transition={transition}
            >
              <button
                type="button"
                tabIndex={open || trigger === 'hover' ? 0 : -1}
                className={cx(
                  'block rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                  open ? 'cursor-pointer' : 'pointer-events-none',
                )}
                onClick={() => {
                  if (!open) {
                    setOpen(true)
                    return
                  }
                  onSelect?.(item.id)
                }}
              >
                <CalendarGlassCard
                  title={item.title}
                  meta={item.meta}
                  tone={item.tone}
                  icon={item.icon}
                  frosted={open}
                  elevated
                  className={
                    compact ? 'h-auto min-h-[6.5rem] w-[10.5rem]' : undefined
                  }
                />
              </button>
            </motion.li>
          )
        })}
      </ul>

      {open && trigger === 'click' ? (
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-caption-1-medium text-text-tertiary">
          Elige una card
        </p>
      ) : null}
    </div>
  )
}

export const CALENDAR_CARD_FAN_DEMO: FanCardItem[] = [
  {
    id: '1',
    title: 'Meeting Notes Digest',
    meta: '8:00 AM · daily · UTC',
    tone: 'yellow',
    icon: RiPlaneLine,
  },
  {
    id: '2',
    title: 'Word Of The Day',
    meta: '7:00 AM · daily · UTC',
    tone: 'purple',
    icon: RiHeartLine,
  },
  {
    id: '3',
    title: 'Message Mom Happy Birthday',
    meta: '7:00 AM · UTC',
    tone: 'pink',
    icon: RiCake2Line,
  },
  {
    id: '4',
    title: 'Weekly Spend Report',
    meta: '7:00 AM · weekly',
    tone: 'lime',
    icon: RiShoppingCart2Line,
  },
  {
    id: '5',
    title: 'Send Stale PR Alert',
    meta: '8:00 AM · daily · UTC',
    tone: 'emerald',
    icon: RiNotification3Line,
  },
  {
    id: '6',
    title: 'Rent Reminder To Roommate',
    meta: '8:00 AM · UTC',
    tone: 'blue',
    icon: RiChat3Line,
  },
  {
    id: '7',
    title: 'Design Review Digest',
    meta: '8:00 AM · daily · UTC',
    tone: 'muted',
    icon: RiSparklingLine,
  },
  {
    id: '8',
    title: 'Message Me Weather Outfit',
    meta: '8:00 AM · daily · UTC',
    tone: 'muted',
    icon: RiSunLine,
  },
]
