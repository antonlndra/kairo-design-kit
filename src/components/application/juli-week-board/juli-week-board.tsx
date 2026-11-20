'use client'

import * as React from 'react'
import {
  RiBarChartBoxLine,
  RiCalendarLine,
  RiChat3Line,
  RiDeleteBinLine,
  RiFolder3Line,
  RiLightbulbLine,
  RiMegaphoneLine,
  RiRefreshLine,
} from '@remixicon/react'
import {
  CalendarCardFan,
  type FanCardItem,
} from '@/components/application/calendar-card-fan/calendar-card-fan'
import {
  GlassAppDock,
  type GlassDockItem,
} from '@/components/application/glass-app-dock/glass-app-dock'
import type { FunnelStage, QueueItem } from '@/lib/types'
import { cx } from '@/utils/cx'
import type { CalendarDayData } from '@/components/application/day-tweet-stack/day-tweet-stack'
import type { CalendarGlassTone } from '@/components/application/calendar-glass-card/calendar-glass-card'

const STAGE_LABEL: Record<FunnelStage, string> = {
  TOF: 'despertar',
  MOF: 'urgencia',
  BOF: 'confirmar',
}

const STAGE_TONE: Record<FunnelStage, CalendarGlassTone> = {
  TOF: 'blue',
  MOF: 'yellow',
  BOF: 'purple',
}

const STAGE_ICON = {
  TOF: RiMegaphoneLine,
  MOF: RiLightbulbLine,
  BOF: RiChat3Line,
} as const

export type JuliWeekBoardProps = {
  days: CalendarDayData[]
  todayIso: string
  regenKey: string | null
  placeMode?: boolean
  onOpenSlot: (key: string) => void
  onDeleteItem?: (itemId: string) => void | Promise<void>
  dock: {
    dayBadge: string
    activeId?: string
    onToday: () => void
    onIdeas: () => void
    onRefresh: () => void
    onAnalytics?: () => void
  }
  className?: string
}

function stageOf(slot: { hour: number; stage?: FunnelStage; item: QueueItem | null }): FunnelStage {
  return slot.stage ?? slot.item?.funnelStage ?? (slot.hour === 9 ? 'TOF' : slot.hour === 12 ? 'MOF' : 'BOF')
}

function slotKey(date: string, hour: number) {
  return `${date}-${hour}`
}

function filledToFanItems(
  day: CalendarDayData,
): Array<FanCardItem & { hour: number; itemId: string }> {
  const out: Array<FanCardItem & { hour: number; itemId: string }> = []
  for (const slot of day.slots) {
    if (!slot.item) continue
    const stage = stageOf(slot)
    out.push({
      id: slotKey(day.date, slot.hour),
      itemId: slot.item.id,
      hour: slot.hour,
      title: slot.item.hook?.split('\n')[0] || STAGE_LABEL[stage],
      meta: `${String(slot.hour).padStart(2, '0')}:00 · ${STAGE_LABEL[stage]}`,
      tone: slot.item.status === 'posted' ? 'muted' : STAGE_TONE[stage],
      icon: STAGE_ICON[stage],
    })
  }
  return out
}

/**
 * Week board for lab: same-day tweets stack → click fans out → pick one.
 * Not wired into production calendar.
 */
export function JuliWeekBoard({
  days,
  todayIso,
  placeMode = false,
  onOpenSlot,
  onDeleteItem,
  dock,
  className,
}: JuliWeekBoardProps) {
  const [fannedDay, setFannedDay] = React.useState<string | null>(null)
  const [trashMode, setTrashMode] = React.useState(false)

  const dockItems: GlassDockItem[] = [
    { id: 'today', label: 'Hoy', icon: RiCalendarLine, badge: dock.dayBadge },
    { id: 'ideas', label: 'Ideas', icon: RiFolder3Line },
    { id: 'refresh', label: 'Actualizar', icon: RiRefreshLine },
    { id: 'analytics', label: 'Dashboard', icon: RiBarChartBoxLine },
    {
      id: 'trash',
      label: trashMode ? 'Salir de borrar' : 'Borrar tweets',
      icon: RiDeleteBinLine,
      active: trashMode,
    },
  ]

  const onDockSelect = (id: string) => {
    if (id === 'today') dock.onToday()
    else if (id === 'ideas') dock.onIdeas()
    else if (id === 'refresh') dock.onRefresh()
    else if (id === 'analytics') dock.onAnalytics?.()
    else if (id === 'trash') {
      setFannedDay(null)
      setTrashMode((v) => !v)
    }
  }

  return (
    <div className={cx('relative', className)}>
      {placeMode ? (
        <p className="mb-3 text-body-regular text-accent-700">
          Modo colocar idea — toca un slot vacío del día.
        </p>
      ) : null}
      {trashMode ? (
        <p className="mb-3 text-body-regular text-text-error-primary">
          Modo borrar — abre el stack y elige la card a eliminar.
        </p>
      ) : (
        <p className="mb-3 text-body-regular text-text-tertiary">
          Varios tweets el mismo día → stack. Toca el stack → fan. Elige una card.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {days.map((day) => {
          const isToday = day.date === todayIso
          const filled = filledToFanItems(day)
          const emptySlots = day.slots.filter((s) => !s.item)
          const isFanned = fannedDay === day.date

          return (
            <div
              key={day.date}
              className={cx(
                'relative flex flex-col gap-2 rounded-3xl border border-border-button-default/60 bg-background-primary-default/40 p-2.5',
                isToday && 'ring-1 ring-accent-300/70',
                isFanned &&
                  'z-30 min-h-[24rem] bg-background-primary-default shadow-xl ring-1 ring-accent-200',
              )}
            >
              <div className="flex items-baseline justify-between gap-2 px-1">
                <p
                  className={cx(
                    'text-caption-1-semibold',
                    isToday ? 'text-accent-700' : 'text-text-tertiary',
                  )}
                >
                  {day.dayName}{' '}
                  <span
                    className={cx(
                      'inline-flex size-6 items-center justify-center rounded-full tabular-nums',
                      isToday && 'bg-accent-500 text-white',
                    )}
                  >
                    {day.date.slice(8)}
                  </span>
                </p>
                <span className="text-caption-1-medium text-text-tertiary">
                  {filled.length}/3
                </span>
              </div>

              <div
                className={cx(
                  'relative flex min-h-[11rem] flex-col items-center justify-center overflow-visible',
                  isFanned && 'min-h-[22rem] py-2',
                )}
              >
                {filled.length === 0 ? (
                  <p className="px-2 text-center text-body-2-medium text-text-tertiary">
                    Sin tweets
                  </p>
                ) : (
                  <CalendarCardFan
                    items={filled}
                    compact={!isFanned}
                    radius={isFanned ? 118 : 72}
                    trigger="click"
                    open={isFanned}
                    className={isFanned ? 'size-[22rem] sm:size-[24rem]' : 'size-[11rem]'}
                    onOpenChange={(next) => {
                      setFannedDay(next ? day.date : null)
                    }}
                    onSelect={(id) => {
                      const hit = filled.find((f) => f.id === id)
                      if (!hit) return
                      if (trashMode && onDeleteItem) {
                        void onDeleteItem(hit.itemId)
                        setFannedDay(null)
                        return
                      }
                      onOpenSlot(id)
                      setFannedDay(null)
                    }}
                  />
                )}
              </div>

              {emptySlots.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {emptySlots.map((slot) => {
                    const stage = stageOf(slot)
                    const key = slotKey(day.date, slot.hour)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onOpenSlot(key)}
                        className={cx(
                          'rounded-xl border border-dashed border-border-button-default px-2.5 py-2 text-left outline-none',
                          'hover:border-accent-300 hover:bg-accent-50/40',
                          'focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                          placeMode && 'border-accent-400 bg-accent-50/50',
                        )}
                      >
                        <span className="text-caption-1-medium text-text-tertiary">
                          {String(slot.hour).padStart(2, '0')}:00 · {STAGE_LABEL[stage]}
                        </span>
                        <span className="mt-0.5 block text-caption-1-semibold text-text-secondary">
                          Slot vacío
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center pb-2">
        <GlassAppDock
          items={dockItems}
          activeId={trashMode ? 'trash' : dock.activeId ?? 'today'}
          onSelect={onDockSelect}
        />
      </div>
    </div>
  )
}
