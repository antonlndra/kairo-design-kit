'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion, type Transition } from 'motion/react'
import { RiMicLine } from '@remixicon/react'
import {
  CalendarGlassCard,
  type CalendarGlassTone,
} from '@/components/application/calendar-glass-card/calendar-glass-card'
import { cx } from '@/utils/cx'

export type CalendarGlassDragProps = {
  title?: string
  meta?: string
  tone?: CalendarGlassTone
  /** Label shown on the floating ghost while dragging (e.g. "Tue 8:00 AM"). */
  slotLabel?: string
  className?: string
  onDrop?: (point: { x: number; y: number }) => void
}

type Point = { x: number; y: number }

const springSettle: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.35,
}

/**
 * Draggable glass event card with a frosted ghost that follows the pointer 1:1
 * (juli.so drag). Demo-ready; wire into calendar DnD later.
 */
export function CalendarGlassDrag({
  title = 'Voice note draft',
  meta = 'Drag me · UTC',
  tone = 'emerald',
  slotLabel = 'Tue 8:00 AM',
  className,
  onDrop,
}: CalendarGlassDragProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [ghost, setGhost] = React.useState<Point | null>(null)
  const grab = React.useRef<Point>({ x: 0, y: 0 })
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const endDrag = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!dragging) return
      setDragging(false)
      setGhost(null)
      onDrop?.({ x: clientX, y: clientY })
    },
    [dragging, onDrop],
  )

  React.useEffect(() => {
    if (!dragging) return

    const onMove = (e: PointerEvent) => {
      setGhost({
        x: e.clientX - grab.current.x,
        y: e.clientY - grab.current.y,
      })
    }
    const onUp = (e: PointerEvent) => endDrag(e.clientX, e.clientY)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, endDrag])

  return (
    <div ref={rootRef} className={cx('relative inline-block touch-none', className)}>
      <motion.div
        animate={{
          opacity: dragging ? 0.35 : 1,
          scale: dragging ? 0.96 : 1,
        }}
        transition={reduceMotion ? { duration: 0 } : springSettle}
      >
        <div
          role="button"
          tabIndex={0}
          aria-grabbed={dragging}
          aria-label={`Arrastrar ${title}`}
          className="cursor-grab rounded-2xl outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          onPointerDown={(e) => {
            if (e.button !== 0) return
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            grab.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
            setGhost({ x: rect.left, y: rect.top })
            setDragging(true)
            e.currentTarget.setPointerCapture?.(e.pointerId)
          }}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') e.preventDefault()
          }}
        >
          <CalendarGlassCard title={title} meta={meta} tone={tone} icon={RiMicLine} elevated />
        </div>
      </motion.div>

      {mounted &&
        dragging &&
        ghost &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[80]"
            style={{ left: ghost.x, top: ghost.y }}
          >
            <div className="relative">
              <span
                className={cx(
                  'absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1',
                  'bg-accent-500 text-caption-1-semibold text-white shadow-md',
                )}
              >
                {slotLabel}
              </span>
              <CalendarGlassCard
                title={title}
                meta={meta}
                tone={tone}
                icon={RiMicLine}
                frosted
                elevated
                className="rotate-[-4deg] shadow-xl"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
