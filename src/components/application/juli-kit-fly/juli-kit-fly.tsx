'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { JuliWeekBoard } from '@/components/application/juli-week-board/juli-week-board'
import type { CalendarDayData } from '@/components/application/day-tweet-stack/day-tweet-stack'
import type { FunnelStage, QueueItem } from '@/lib/types'
import { cx } from '@/utils/cx'

const HOURS = [9, 12, 18] as const
const STAGE: Record<number, FunnelStage> = { 9: 'TOF', 12: 'MOF', 18: 'BOF' }
const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function mondayIso(d = new Date()) {
  const start = new Date(d)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)
  return start.toISOString().slice(0, 10)
}

function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return dt.toISOString().slice(0, 10)
}

function mockItem(
  id: string,
  hook: string,
  stage: FunnelStage,
  date: string,
  hour: number,
): QueueItem {
  return {
    id,
    hook,
    body: 'Sandbox local — no toca la API ni el calendario real.',
    format: 'tweet',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    scheduledAt: `${date}T${String(hour).padStart(2, '0')}:00:00`,
    funnelStage: stage,
  }
}

function buildDemoWeek(weekStart: string): CalendarDayData[] {
  const seeds: Array<{ day: number; hour: number; hook: string }> = [
    { day: 0, hour: 9, hook: 'tu feed se ve caro y tu oferta barata' },
    { day: 1, hour: 9, hook: 'si tu pitch suena igual al de todos, ya perdiste' },
    { day: 1, hour: 12, hook: 'bonito que no cierra es decoración cara' },
    { day: 1, hour: 18, hook: 'el ICP ve coste de oportunidad en parecer uno más' },
    { day: 3, hour: 9, hook: 'un logo no es una marca' },
    { day: 3, hour: 12, hook: 'seguir con diseño genérico te está costando clientes' },
    { day: 4, hour: 12, hook: 'el founder que “ya lo hace él” pierde semanas' },
    { day: 5, hour: 18, hook: 'así se decide un deck que se entiende' },
  ]

  return DAY_NAMES.map((dayName, i) => {
    const date = addDays(weekStart, i)
    return {
      date,
      dayName,
      slots: HOURS.map((hour) => {
        const hit = seeds.find((s) => s.day === i && s.hour === hour)
        const stage = STAGE[hour]
        return {
          hour,
          stage,
          item: hit
            ? mockItem(`fly-${i}-${hour}`, hit.hook, stage, date, hour)
            : null,
        }
      }),
    }
  })
}

export type JuliKitFlyProps = {
  className?: string
}

/**
 * Floating fly on void calendar — opens Juli kit sandbox (stack → fan).
 * Local state only; does not touch production calendar data.
 */
export function JuliKitFly({ className }: JuliKitFlyProps) {
  const weekStart = React.useMemo(() => mondayIso(), [])
  const todayIso = new Date().toISOString().slice(0, 10)
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [days, setDays] = React.useState(() => buildDemoWeek(weekStart))
  const [log, setLog] = React.useState('Toca un stack → fan → elige')
  const [seed, setSeed] = React.useState(0)
  const [selected, setSelected] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const selectedSlot = React.useMemo(() => {
    if (!selected) return null
    for (const day of days) {
      for (const slot of day.slots) {
        if (`${day.date}-${slot.hour}` === selected) return { day, slot }
      }
    }
    return null
  }, [days, selected])

  const deleteItem = React.useCallback((itemId: string) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        slots: day.slots.map((s) => (s.item?.id === itemId ? { ...s, item: null } : s)),
      })),
    )
    setSelected(null)
    setLog('Borrado (sandbox)')
  }, [])

  const reset = React.useCallback(() => {
    setDays(buildDemoWeek(weekStart))
    setSelected(null)
    setSeed((n) => n + 1)
    setLog('Demo reiniciada')
  }, [weekStart])

  return (
    <>
      <button
        type="button"
        aria-label="Abrir Juli kit"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cx(
          'group relative flex h-28 w-36 flex-col items-center justify-end outline-none',
          'focus-visible:ring-2 focus-visible:ring-border-focus-ring',
          className,
        )}
      >
        <span
          className={cx(
            'relative flex h-24 w-32 items-end justify-center overflow-hidden rounded-3xl',
            'border border-accent-200/40 shadow-lg transition-transform group-hover:scale-[1.03] group-active:scale-95',
          )}
          style={{
            background:
              'linear-gradient(145deg, color-mix(in oklab, var(--color-accent-300) 50%, transparent), color-mix(in oklab, var(--color-accent-700) 90%, transparent) 60%, var(--color-accent-950))',
          }}
        >
          <span className="absolute inset-x-3 top-3 h-10 rounded-xl bg-background-primary-default/90 shadow-sm" />
          <span className="absolute inset-x-4 top-5 h-10 rotate-[-6deg] rounded-xl bg-calendar-event-yellow-background/90 shadow-sm" />
          <span className="absolute inset-x-5 top-7 h-10 rotate-[5deg] rounded-xl bg-calendar-event-pink-background/90 shadow-sm" />
          <span className="relative mb-2 rounded-full bg-background-primary-default/20 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
            Juli · fan
          </span>
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                key="juli-fly-layer"
                className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  type="button"
                  aria-label="Cerrar"
                  className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Juli kit"
                  className="relative z-10 flex max-h-[min(92dvh,920px)] w-full max-w-[96rem] flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-full shadow-xl"
                  initial={{ y: 24, opacity: 0.9, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                >
                  <header className="flex shrink-0 items-center justify-between gap-3 border-b border-separator-border px-4 py-3">
                    <div>
                      <p className="text-caption-1-semibold uppercase tracking-wider text-text-tertiary">
                        Fly · sandbox local
                      </p>
                      <h2 className="text-title-3-semibold text-text-primary">Juli kit</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={reset}
                        className="rounded-full border border-border-button-default px-3 py-1.5 text-caption-1-semibold text-text-secondary outline-none hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        aria-label="Cerrar Juli kit"
                        onClick={() => setOpen(false)}
                        className="flex size-9 items-center justify-center rounded-full border border-border-button-default text-foreground-icon-secondary outline-none hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </header>

                  <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5">
                    <p className="mb-3 rounded-2xl border border-border-button-default bg-background-secondary-default/70 px-3 py-2 text-caption-1-medium text-text-secondary">
                      {log}
                    </p>
                    <JuliWeekBoard
                      key={seed}
                      days={days}
                      todayIso={todayIso}
                      regenKey={null}
                      onOpenSlot={(key) => {
                        setSelected(key)
                        setLog(`Elegida · ${key}`)
                      }}
                      onDeleteItem={deleteItem}
                      dock={{
                        dayBadge: String(new Date().getDate()),
                        onToday: () => setLog('Hoy (sandbox)'),
                        onIdeas: () => setLog('Ideas (sandbox)'),
                        onRefresh: reset,
                        onAnalytics: () => setLog('Dashboard (sandbox)'),
                      }}
                    />
                    {selectedSlot ? (
                      <div className="mt-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-caption-1-semibold text-text-tertiary">
                              {selectedSlot.day.dayName} {selectedSlot.day.date.slice(8)} ·{' '}
                              {String(selectedSlot.slot.hour).padStart(2, '0')}:00
                            </p>
                            <p className="mt-1 text-title-3-semibold text-text-primary">
                              {selectedSlot.slot.item?.hook ?? 'Slot vacío'}
                            </p>
                            {selectedSlot.slot.item?.body ? (
                              <p className="mt-2 text-body-regular text-text-secondary">
                                {selectedSlot.slot.item.body}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelected(null)}
                            className="rounded-full border border-border-button-default px-3 py-1.5 text-caption-1-semibold text-text-secondary outline-none hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
