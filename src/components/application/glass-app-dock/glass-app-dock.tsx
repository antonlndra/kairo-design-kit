'use client'

import type { ComponentType } from 'react'
import {
  RiBarChartBoxLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiFolder3Line,
  RiSettings3Line,
} from '@remixicon/react'
import { cx } from '@/utils/cx'

export type GlassDockItem = {
  id: string
  label: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  /** Optional badge text on the icon tile (e.g. calendar day). */
  badge?: string
  active?: boolean
}

export type GlassAppDockProps = {
  items?: GlassDockItem[]
  activeId?: string
  onSelect?: (id: string) => void
  className?: string
}

export const GLASS_APP_DOCK_DEMO: GlassDockItem[] = [
  { id: 'calendar', label: 'Calendario', icon: RiCalendarLine, badge: '1' },
  { id: 'analytics', label: 'Analytics', icon: RiBarChartBoxLine },
  { id: 'files', label: 'Archivos', icon: RiFolder3Line },
  { id: 'settings', label: 'Ajustes', icon: RiSettings3Line },
  { id: 'trash', label: 'Papelera', icon: RiDeleteBinLine },
]

/**
 * Floating frosted dock (juli.so). Centered pill with icon tiles.
 * Ready for shell chrome — not wired into production nav yet.
 */
export function GlassAppDock({
  items = GLASS_APP_DOCK_DEMO,
  activeId,
  onSelect,
  className,
}: GlassAppDockProps) {
  return (
    <nav
      aria-label="Dock"
      className={cx(
        'inline-flex items-center gap-1 rounded-full border border-border-button-default/70',
        'bg-background-primary-default/55 p-1.5 shadow-xl backdrop-blur-2xl backdrop-saturate-150',
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = activeId ? activeId === item.id : item.active
        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            onClick={() => onSelect?.(item.id)}
            className={cx(
              'relative flex size-11 items-center justify-center rounded-full outline-none transition-transform',
              'text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-foreground-icon-primary',
              'focus-visible:ring-2 focus-visible:ring-border-focus-ring',
              'active:scale-95',
              active && 'bg-background-secondary-default text-accent-700',
            )}
          >
            <Icon className="size-5" aria-hidden />
            {item.badge ? (
              <span className="pointer-events-none absolute inset-x-0 bottom-1.5 text-center text-[9px] font-semibold leading-none text-text-primary">
                {item.badge}
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}
