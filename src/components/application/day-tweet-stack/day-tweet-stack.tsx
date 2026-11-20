'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type Transition } from 'motion/react'
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RotateCcw,
  RotateCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react'
import type { FunnelStage, QueueItem } from '@/lib/types'
import { MorphCopyButton } from '@/components/application/morph-copy-button/morph-copy-button'
import { SquareSnake } from '@/components/application/square-snake/square-snake'
import { TextMorph } from '@/components/application/text-morph/text-morph'
import { Button } from '@/components/ui/button'
import { cx } from '@/utils/cx'

export type DaySlot = {
  hour: number
  stage?: FunnelStage
  item: QueueItem | null
}

export type CalendarDayData = {
  date: string
  dayName: string
  slots: DaySlot[]
}

export type WeekSlotRef = {
  key: string
  date: string
  dayName: string
  hour: number
  stage: FunnelStage
  item: QueueItem | null
}

const STAGE_LABEL: Record<FunnelStage, string> = {
  TOF: 'despertar',
  MOF: 'urgencia',
  BOF: 'confirmar',
}

/** Critically damped default — Apple damping 1.0 / response ~0.35 */
const springSettle: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.35,
}

const textSwitch: Transition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
}

function stageOf(slot: Pick<DaySlot, 'hour' | 'stage' | 'item'>): FunnelStage {
  return slot.stage ?? slot.item?.funnelStage ?? (slot.hour === 9 ? 'TOF' : slot.hour === 12 ? 'MOF' : 'BOF')
}

function tweetText(item: QueueItem): string {
  return [item.hook, item.body].filter(Boolean).join('\n\n')
}

export function flattenWeekSlots(days: CalendarDayData[]): WeekSlotRef[] {
  const out: WeekSlotRef[] = []
  for (const day of days) {
    for (const slot of day.slots) {
      out.push({
        key: `${day.date}-${slot.hour}`,
        date: day.date,
        dayName: day.dayName,
        hour: slot.hour,
        stage: stageOf(slot),
        item: slot.item,
      })
    }
  }
  return out
}

export type DayTweetStackProps = {
  day: CalendarDayData
  isToday?: boolean
  regenKey: string | null
  onOpenSlot: (key: string) => void
}

export type TweetDetailModalProps = {
  days: CalendarDayData[]
  openKey: string
  regenKey: string | null
  copiedId: string | null
  feedbackBusyId?: string | null
  saveBusyId?: string | null
  bankIdeas?: import('@/lib/types').IdeaCandidate[]
  placeBusy?: boolean
  preferredIdeaId?: string | null
  placeMode?: boolean
  onClose: () => void
  onNavigate: (key: string) => void
  onCopy: (id: string, text: string) => void
  onRegen: (date: string, hour: number) => void
  onMarkPosted: (id: string) => void
  onFeedback: (id: string, verdict: 'like' | 'dislike') => void
  onDelete: (id: string) => void
  onSave: (id: string, patch: { hook: string; body: string }) => Promise<void> | void
  onCoach: (item: QueueItem, dayName: string, date: string) => void
  onPlaceIdea?: (idea: import('@/lib/types').IdeaCandidate, date: string, hour: number) => void
  onPlaceManual?: (
    payload: { hook: string; body: string; alreadyPosted: boolean },
    date: string,
    hour: number,
  ) => void
}

export function TweetDetailModal({
  days,
  openKey,
  regenKey,
  copiedId,
  feedbackBusyId,
  saveBusyId,
  bankIdeas,
  placeBusy,
  preferredIdeaId,
  placeMode,
  onClose,
  onNavigate,
  onCopy,
  onRegen,
  onMarkPosted,
  onFeedback,
  onDelete,
  onSave,
  onCoach,
  onPlaceIdea,
  onPlaceManual,
}: TweetDetailModalProps) {
  const weekSlots = React.useMemo(() => flattenWeekSlots(days), [days])
  const index = weekSlots.findIndex((s) => s.key === openKey)
  const current = index >= 0 ? weekSlots[index] : null

  const filled = React.useMemo(() => weekSlots.filter((s) => s.item), [weekSlots])
  const filledIndex = current?.item ? filled.findIndex((s) => s.key === current.key) : -1

  const regenerating = regenKey === openKey
  const itemId = current?.item?.id
  const feedbackBusy = Boolean(itemId && feedbackBusyId === itemId)
  const saveBusy = Boolean(itemId && saveBusyId === itemId)
  const verdict = current?.item?.verdict ?? null

  const [editing, setEditing] = React.useState(false)
  const [draftHook, setDraftHook] = React.useState('')
  const [draftBody, setDraftBody] = React.useState('')
  const [emptyTab, setEmptyTab] = React.useState<'bank' | 'write'>(() =>
    preferredIdeaId || placeMode ? 'bank' : 'write',
  )
  const [alreadyPosted, setAlreadyPosted] = React.useState(false)

  React.useEffect(() => {
    setEditing(false)
    setAlreadyPosted(false)
    setEmptyTab(preferredIdeaId || placeMode ? 'bank' : onPlaceManual ? 'write' : 'bank')
    if (current?.item) {
      setDraftHook(current.item.hook)
      setDraftBody(current.item.body)
    } else {
      setDraftHook('')
      setDraftBody('')
    }
  }, [openKey, current?.item?.id, current?.item?.hook, current?.item?.body, preferredIdeaId, placeMode, onPlaceManual])

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const goPrev = React.useCallback(() => {
    if (filledIndex <= 0) return
    onNavigate(filled[filledIndex - 1].key)
  }, [filled, filledIndex, onNavigate])

  const goNext = React.useCallback(() => {
    if (filledIndex < 0 || filledIndex >= filled.length - 1) return
    onNavigate(filled[filledIndex + 1].key)
  }, [filled, filledIndex, onNavigate])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editing) {
          setEditing(false)
          if (current?.item) {
            setDraftHook(current.item.hook)
            setDraftBody(current.item.body)
          }
          return
        }
        onClose()
        return
      }
      if (editing) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, editing, current?.item, goPrev, goNext])

  if (!current) return null

  const stage = current.stage
  const canPrev = filledIndex > 0
  const canNext = filledIndex >= 0 && filledIndex < filled.length - 1

  const handleSave = async () => {
    if (!current.item) return
    await onSave(current.item.id, {
      hook: draftHook.trim(),
      body: draftBody.trim(),
    })
    setEditing(false)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.22 }}
    >
      <motion.button
        type="button"
        aria-label="Cerrar"
        className="apple-scrim absolute inset-0 cursor-default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.28 }}
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tweet-modal-title"
        className="depth-surface relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border-0 p-5"
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: 18, filter: 'blur(8px)' }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
        }
        exit={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: 14, filter: 'blur(6px)' }
        }
        transition={
          reduceMotion
            ? { duration: 0.15 }
            : { type: 'spring', bounce: 0, duration: 0.4 }
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <TextMorph
              as="span"
              className="text-caption-2-semibold uppercase tracking-wide text-text-tertiary"
            >
              {`${current.dayName} · ${String(current.hour).padStart(2, '0')}:00 · ${STAGE_LABEL[stage]}`}
            </TextMorph>
            <p className="mt-1 text-title-3-semibold text-text-primary">
              <TextMorph>{current.item ? 'Tweet del día' : 'Slot vacío'}</TextMorph>
            </p>
            {filled.length > 0 && filledIndex >= 0 ? (
              <div className="mt-0.5 flex">
                <TextMorph
                  numbers
                  className="text-caption-1-regular text-text-tertiary tabular-nums"
                >
                  {`${filledIndex + 1} / ${filled.length}`}
                </TextMorph>
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {filled.length > 1 ? (
              <>
                <button
                  type="button"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full text-text-tertiary outline-none transition-colors duration-150 hover:bg-background-secondary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:opacity-40"
                  onClick={goPrev}
                  disabled={!canPrev || editing}
                  aria-label="Tweet anterior"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full text-text-tertiary outline-none transition-colors duration-150 hover:bg-background-secondary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:opacity-40"
                  onClick={goNext}
                  disabled={!canNext || editing}
                  aria-label="Tweet siguiente"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            ) : null}
            <button
              type="button"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-tertiary outline-none transition-colors duration-150 hover:bg-background-secondary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {current.item ? (
          <div className="space-y-4">
            <div className="max-h-[min(50vh,24rem)] space-y-2 overflow-y-auto rounded-2xl bg-background-secondary-default p-4">
              {editing ? (
                <>
                  <label className="block space-y-1">
                    <span className="text-caption-1-semibold text-text-tertiary">Hook</span>
                    <textarea
                      value={draftHook}
                      onChange={(e) => setDraftHook(e.target.value)}
                      rows={2}
                      className="w-full resize-y rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-caption-1-semibold text-text-tertiary">Cuerpo</span>
                    <textarea
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      rows={5}
                      className="w-full resize-y rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-regular text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                    />
                  </label>
                </>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-body-semibold text-text-primary">
                    {current.item.hook}
                  </p>
                  {current.item.body ? (
                    <p className="whitespace-pre-wrap text-body-regular text-text-secondary">
                      {current.item.body}
                    </p>
                  ) : null}
                  {current.item.why ? (
                    <p className="text-caption-1-regular italic text-text-tertiary">
                      {current.item.why}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            {editing ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="glossy"
                  size="sm"
                  disabled={saveBusy || !draftHook.trim()}
                  onClick={() => void handleSave()}
                >
                  {saveBusy ? <SquareSnake size="sm" className="brightness-200" /> : null}
                  Guardar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={saveBusy}
                  onClick={() => {
                    setEditing(false)
                    setDraftHook(current.item!.hook)
                    setDraftBody(current.item!.body)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cx(verdict === 'like' && 'border-accent-500 text-accent-700')}
                    disabled={feedbackBusy}
                    aria-pressed={verdict === 'like'}
                    aria-label="Me gusta este estilo"
                    onClick={() => onFeedback(current.item!.id, 'like')}
                  >
                    <ThumbsUp className="size-3.5" />
                    <TextMorph>{verdict === 'like' ? 'Te gusta' : 'Me gusta'}</TextMorph>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cx(verdict === 'dislike' && 'border-border-error-default text-text-error-primary')}
                    disabled={feedbackBusy}
                    aria-pressed={verdict === 'dislike'}
                    aria-label="No me gusta este estilo"
                    onClick={() => onFeedback(current.item!.id, 'dislike')}
                  >
                    <ThumbsDown className="size-3.5" />
                    <TextMorph>{verdict === 'dislike' ? 'No te gusta' : 'No me gusta'}</TextMorph>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <MorphCopyButton
                    copied={copiedId === current.item.id}
                    onCopy={() => onCopy(current.item!.id, tweetText(current.item!))}
                  />
                  <Button
                    type="button"
                    variant="glossy"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => onCoach(current.item!, current.dayName, current.date)}
                  >
                    <Sparkles className="size-3.5" />
                    Mejorar con IA
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={regenerating}
                    onClick={() => void onRegen(current.date, current.hour)}
                  >
                    {regenerating ? <SquareSnake size="sm" /> : <RotateCw className="size-3.5" />}
                    Regenerar
                  </Button>
                  {current.item.status !== 'posted' ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void onMarkPosted(current.item!.id)}
                    >
                      <Check className="size-3.5" />
                      Publicado
                    </Button>
                  ) : (
                    <span className="inline-flex min-h-11 items-center text-caption-1-semibold text-accent-700">
                      Ya publicado
                    </span>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-text-error-primary"
                    onClick={() => {
                      onDelete(current.item!.id)
                      onClose()
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {onPlaceIdea || onPlaceManual ? (
              <>
                {onPlaceIdea && onPlaceManual ? (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEmptyTab('write')}
                      className={cx(
                        'inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3 text-caption-1-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                        emptyTab === 'write'
                          ? 'border-accent-500 bg-accent-500 text-white'
                          : 'border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-secondary-hover',
                      )}
                    >
                      Escribir yo
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmptyTab('bank')}
                      className={cx(
                        'inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3 text-caption-1-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                        emptyTab === 'bank'
                          ? 'border-accent-500 bg-accent-500 text-white'
                          : 'border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-secondary-hover',
                      )}
                    >
                      Del banco
                    </button>
                  </div>
                ) : null}

                {emptyTab === 'write' && onPlaceManual ? (
                  <>
                    <p className="text-body-regular text-text-secondary">
                      Escribe tu tweet para las {String(current.hour).padStart(2, '0')}:00 (
                      {STAGE_LABEL[stage]}). Planning tuyo, no solo ideas de Kairo.
                    </p>
                    <label className="block space-y-1">
                      <span className="text-caption-1-semibold text-text-tertiary">Hook</span>
                      <textarea
                        value={draftHook}
                        onChange={(e) => setDraftHook(e.target.value)}
                        rows={2}
                        placeholder="Primera línea…"
                        className="w-full resize-y rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-caption-1-semibold text-text-tertiary">Cuerpo</span>
                      <textarea
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        rows={5}
                        placeholder="Resto del tweet (opcional)…"
                        className="w-full resize-y rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-regular text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      />
                    </label>
                    <label className="flex min-h-11 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={alreadyPosted}
                        onChange={(e) => setAlreadyPosted(e.target.checked)}
                        className="size-4 rounded border-border-button-default accent-[var(--color-accent-500,#1A00FF)]"
                      />
                      <span className="text-caption-1-semibold text-text-secondary">
                        Ya publicado en X
                      </span>
                    </label>
                    <Button
                      type="button"
                      variant="glossy"
                      size="sm"
                      className="gap-1.5"
                      disabled={placeBusy || !draftHook.trim()}
                      onClick={() =>
                        onPlaceManual(
                          {
                            hook: draftHook.trim(),
                            body: draftBody.trim(),
                            alreadyPosted,
                          },
                          current.date,
                          current.hour,
                        )
                      }
                    >
                      {placeBusy ? (
                        <SquareSnake size="sm" className="brightness-200" />
                      ) : (
                        <Plus className="size-3.5" />
                      )}
                      Colocar en slot
                    </Button>
                  </>
                ) : onPlaceIdea ? (
                  <>
                    <p className="text-body-regular text-text-secondary">
                      {placeMode
                        ? 'Elige una idea del banco para este slot.'
                        : `Coloca una idea del banco a las ${String(current.hour).padStart(2, '0')}:00 (${STAGE_LABEL[stage]}).`}
                    </p>
                    {(bankIdeas?.length ?? 0) === 0 ? (
                      <p className="text-body-regular text-text-tertiary">
                        El banco está vacío. Genera ideas y guárdalas, o cambia a «Escribir yo».
                      </p>
                    ) : (
                      <ul className="max-h-[min(40vh,18rem)] space-y-2 overflow-y-auto">
                        {bankIdeas!.map((idea) => {
                          const preferred = preferredIdeaId === idea.id
                          return (
                            <li key={idea.id}>
                              <button
                                type="button"
                                disabled={placeBusy}
                                onClick={() => onPlaceIdea(idea, current.date, current.hour)}
                                className={cx(
                                  'w-full rounded-2xl border px-3 py-2.5 text-left outline-none transition-colors',
                                  'focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                                  preferred
                                    ? 'border-accent-500 bg-accent-50'
                                    : 'border-border-button-default bg-background-secondary-default hover:bg-background-secondary-hover',
                                  placeBusy && 'opacity-50',
                                )}
                              >
                                <p className="line-clamp-2 text-body-semibold text-text-primary">
                                  {idea.hook}
                                </p>
                                {(idea.angle || idea.why) && (
                                  <p className="mt-1 line-clamp-2 text-caption-1-regular text-text-secondary">
                                    {idea.angle || idea.why}
                                  </p>
                                )}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {placeBusy ? (
                      <div className="flex justify-center py-2">
                        <SquareSnake size="sm" />
                      </div>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-body-regular text-text-secondary">
                  Genera el tweet de las {String(current.hour).padStart(2, '0')}:00 ({STAGE_LABEL[stage]}).
                </p>
                <Button
                  type="button"
                  variant="glossy"
                  size="sm"
                  className="gap-1.5"
                  disabled={regenerating}
                  onClick={() => void onRegen(current.date, current.hour)}
                >
                  {regenerating ? (
                    <SquareSnake size="sm" className="brightness-200" />
                  ) : (
                    <Plus className="size-3.5" />
                  )}
                  Generar tweet
                </Button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function DayTweetStack({ day, isToday = false, regenKey, onOpenSlot }: DayTweetStackProps) {
  const filled = day.slots.filter((s) => s.item).length
  const [expanded, setExpanded] = React.useState(false)

  return (
    <motion.div
      className={cx(
        'depth-surface relative z-0 flex w-full flex-col gap-3 rounded-3xl border-0 p-3',
        'hover:z-20 focus-within:z-20',
        isToday && 'ring-1 ring-accent-300/60',
      )}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      animate={expanded ? 'expanded' : 'collapsed'}
      initial="collapsed"
    >
      <div className="px-0.5">
        <p
          className={cx(
            'text-caption-1-semibold',
            isToday ? 'text-accent-700' : 'text-text-tertiary',
          )}
        >
          {day.dayName}{' '}
          <span className="font-normal tabular-nums">{day.date.slice(8)}</span>
        </p>
      </div>

      <div className="relative isolate">
        {day.slots.map((slot, i) => {
          const stage = stageOf(slot)
          const key = `${day.date}-${slot.hour}`
          const item = slot.item
          const regenerating = regenKey === key
          const overlap = expanded ? 0 : 40

          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onOpenSlot(key)}
              whileTap={{ scale: 0.97 }}
              className={cx(
                'relative w-full rounded-2xl border px-3 py-2.5 text-left outline-none',
                'bg-background-primary-default shadow-sm',
                'focus-visible:ring-2 focus-visible:ring-border-focus-ring',
                item?.verdict === 'like' && 'border-accent-500',
                item?.verdict === 'dislike' && 'border-border-error-default',
                !item?.verdict && 'border-border-button-default',
                !item && 'border-dashed border-border-button-default bg-background-secondary-default',
              )}
              style={{ zIndex: day.slots.length - i, willChange: 'transform, margin-top' }}
              animate={{
                marginTop: i === 0 ? 0 : -overlap,
                scale: expanded ? 1 : 1 - i * 0.04,
              }}
              transition={springSettle}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="line-clamp-1 text-caption-1-semibold text-text-primary">
                  {item?.hook?.split('\n')[0] || `Slot ${String(slot.hour).padStart(2, '0')}:00`}
                </h2>
                <div className="flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-text-tertiary">
                  {item?.verdict === 'like' ? (
                    <ThumbsUp className="size-3 text-accent-700" aria-label="Te gusta" />
                  ) : item?.verdict === 'dislike' ? (
                    <ThumbsDown className="size-3 text-text-error-primary" aria-label="No te gusta" />
                  ) : null}
                  {item?.status === 'posted' ? (
                    <Check className="size-3 text-accent-700" />
                  ) : regenerating ? (
                    <SquareSnake size="sm" />
                  ) : (
                    <>
                      <RotateCcw className="size-3" />
                      <span>{stage}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-text-tertiary">
                <span>{String(slot.hour).padStart(2, '0')}:00</span>
                &nbsp;•&nbsp;
                <span>{item ? STAGE_LABEL[stage] : 'vacío'}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 px-0.5">
        <div
          className={cx(
            'flex size-5 items-center justify-center rounded-full text-[10px] font-medium text-white',
            filled > 0 ? 'bg-accent-500' : 'bg-text-tertiary',
          )}
        >
          {filled}
        </div>
        <span className="relative grid min-h-4 flex-1">
          <motion.span
            className="col-start-1 row-start-1 text-caption-1-semibold text-text-secondary"
            animate={{
              opacity: expanded ? 0 : 1,
              y: expanded ? -8 : 0,
            }}
            transition={textSwitch}
          >
            {filled}/3 tweets
          </motion.span>
          <motion.span
            className="col-start-1 row-start-1 flex items-center gap-1 text-caption-1-semibold text-text-secondary"
            animate={{
              opacity: expanded ? 1 : 0,
              y: expanded ? 0 : 8,
            }}
            transition={textSwitch}
          >
            Abre un tweet <ArrowUpRight className="size-3.5" />
          </motion.span>
        </span>
      </div>
    </motion.div>
  )
}

export function WeekTweetModalPortal({
  openKey,
  days,
  ...modalProps
}: Omit<TweetDetailModalProps, 'openKey'> & { openKey: string | null }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {openKey ? (
        <TweetDetailModal key="week-tweet-modal" openKey={openKey} days={days} {...modalProps} />
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
