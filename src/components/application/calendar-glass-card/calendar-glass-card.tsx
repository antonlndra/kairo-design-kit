'use client'

import type { ComponentType, HTMLAttributes } from 'react'
import { RiMoreFill } from '@remixicon/react'
import { cx } from '@/utils/cx'

export type CalendarGlassTone =
  | 'blue'
  | 'pink'
  | 'purple'
  | 'lime'
  | 'emerald'
  | 'yellow'
  | 'muted'

export type CalendarGlassCardProps = {
  title: string
  meta: string
  tone?: CalendarGlassTone
  icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  /** Glass + blur when the card is lifted (drag / fan foreground). */
  frosted?: boolean
  /** Softer elevation for stacked / background layers. */
  elevated?: boolean
  onMenuClick?: () => void
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>

const TONE: Record<
  CalendarGlassTone,
  { surface: string; title: string; meta: string; icon: string; glow: string }
> = {
  blue: {
    surface: 'bg-calendar-event-blue-background/85',
    title: 'text-calendar-event-blue-title',
    meta: 'text-calendar-event-blue-time/80',
    icon: 'text-calendar-event-blue-title',
    glow: 'shadow-[0_10px_28px_-8px_color-mix(in_oklab,var(--color-calendar-event-blue-title)_35%,transparent)]',
  },
  pink: {
    surface: 'bg-calendar-event-pink-background/85',
    title: 'text-calendar-event-pink-title',
    meta: 'text-calendar-event-pink-time/80',
    icon: 'text-calendar-event-pink-title',
    glow: 'shadow-[0_10px_28px_-8px_color-mix(in_oklab,var(--color-calendar-event-pink-title)_35%,transparent)]',
  },
  purple: {
    surface: 'bg-calendar-event-purple-background/85',
    title: 'text-calendar-event-purple-title',
    meta: 'text-calendar-event-purple-time/80',
    icon: 'text-calendar-event-purple-title',
    glow: 'shadow-[0_10px_28px_-8px_color-mix(in_oklab,var(--color-calendar-event-purple-title)_35%,transparent)]',
  },
  lime: {
    surface: 'bg-calendar-event-lime-background/85',
    title: 'text-calendar-event-lime-title',
    meta: 'text-calendar-event-lime-time/80',
    icon: 'text-calendar-event-lime-title',
    glow: 'shadow-[0_10px_28px_-8px_color-mix(in_oklab,var(--color-calendar-event-lime-title)_35%,transparent)]',
  },
  emerald: {
    surface: 'bg-calendar-event-emerald-background/85',
    title: 'text-calendar-event-emerald-title',
    meta: 'text-calendar-event-emerald-time/80',
    icon: 'text-calendar-event-emerald-title',
    glow: 'shadow-[0_10px_28px_-8px_color-mix(in_oklab,var(--color-calendar-event-emerald-title)_35%,transparent)]',
  },
  yellow: {
    surface: 'bg-status-yellow-background/90',
    title: 'text-status-yellow-text',
    meta: 'text-status-yellow-text/80',
    icon: 'text-status-yellow-text',
    glow: 'shadow-[0_10px_28px_-8px_color-mix(in_oklab,var(--color-status-yellow-text)_30%,transparent)]',
  },
  muted: {
    surface: 'bg-background-secondary-default/90',
    title: 'text-text-primary',
    meta: 'text-text-tertiary',
    icon: 'text-foreground-icon-secondary',
    glow: 'shadow-lg',
  },
}

/**
 * Event card inspired by juli.so: tinted glass surface, icon + menu row,
 * meta line, bold title. Ready for calendar slots / fan stacks — not wired yet.
 */
export function CalendarGlassCard({
  title,
  meta,
  tone = 'blue',
  icon: Icon,
  frosted = false,
  elevated = true,
  onMenuClick,
  className,
  ...rest
}: CalendarGlassCardProps) {
  const t = TONE[tone]

  return (
    <div
      {...rest}
      className={cx(
        'relative flex h-[7.25rem] w-[11.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-background-primary-default/45 p-3',
        t.surface,
        elevated && t.glow,
        frosted && 'backdrop-blur-xl backdrop-saturate-150',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cx(
            'flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-primary-default/35',
            t.icon,
          )}
          aria-hidden
        >
          {Icon ? <Icon className="size-4" aria-hidden /> : null}
        </span>
        {onMenuClick ? (
          <button
            type="button"
            aria-label="Más opciones"
            onClick={(e) => {
              e.stopPropagation()
              onMenuClick()
            }}
            className={cx(
              'flex size-7 shrink-0 items-center justify-center rounded-md outline-none',
              'text-foreground-icon-quaternary hover:bg-background-primary-default/40 hover:text-foreground-icon-secondary',
              'focus-visible:ring-2 focus-visible:ring-border-focus-ring',
            )}
          >
            <RiMoreFill className="size-4" aria-hidden />
          </button>
        ) : (
          <span className="flex size-7 items-center justify-center text-foreground-icon-quaternary" aria-hidden>
            <RiMoreFill className="size-4 opacity-50" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <p className={cx('truncate text-caption-1-medium', t.meta)}>{meta}</p>
        <p className={cx('line-clamp-2 text-body-2-semibold', t.title)}>{title}</p>
      </div>
    </div>
  )
}
