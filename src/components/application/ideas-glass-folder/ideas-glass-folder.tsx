'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Lightbulb, X } from 'lucide-react'
import type { IdeaCandidate } from '@/lib/types'
import { cx } from '@/utils/cx'

const folderBody = {
  closed: { rotateX: 0, scale: 1 },
  hover: { scale: 1.03, transition: { type: 'spring' as const, stiffness: 220, damping: 20 } },
  open: { scale: 1.04, transition: { type: 'spring' as const, stiffness: 180, damping: 18 } },
}

const folderLid = {
  closed: { rotateX: -18, transition: { type: 'spring' as const, stiffness: 70, damping: 18 } },
  hover: { rotateX: -40, transition: { type: 'spring' as const, stiffness: 110, damping: 16 } },
  open: { rotateX: -50, transition: { type: 'spring' as const, stiffness: 100, damping: 16 } },
}

const POPOVER_W = 352
const POPOVER_MARGIN = 16
const POPOVER_GAP = 12

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

type IdeasGlassFolderProps = {
  ideas: IdeaCandidate[]
  className?: string
  onOpenBank: () => void
  onSelectIdea?: (idea: IdeaCandidate) => void
}

function clampCenterX(centerX: number, width: number) {
  const half = width / 2
  const min = POPOVER_MARGIN + half
  const max = window.innerWidth - POPOVER_MARGIN - half
  if (max <= min) return window.innerWidth / 2
  return Math.min(max, Math.max(min, centerX))
}

export function IdeasGlassFolder({
  ideas,
  className,
  onOpenBank,
  onSelectIdea,
}: IdeasGlassFolderProps) {
  const [open, setOpen] = React.useState(false)
  const [hover, setHover] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [popoverPos, setPopoverPos] = React.useState<{
    left: number
    anchorTop: number
    placement: 'above' | 'below'
    width: number
  } | null>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const popoverRef = React.useRef<HTMLDivElement>(null)
  const papers = ideas.slice(0, 3)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updatePopoverPos = React.useCallback(() => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const width = Math.min(POPOVER_W, window.innerWidth - POPOVER_MARGIN * 2)
    const left = clampCenterX(rect.left + rect.width / 2, width) - width / 2
    const estimatedH = Math.min(420, window.innerHeight * 0.55)
    const spaceAbove = rect.top - POPOVER_MARGIN
    const placement: 'above' | 'below' =
      spaceAbove >= estimatedH * 0.55 ? 'above' : 'below'
    setPopoverPos({
      left,
      anchorTop: placement === 'above' ? rect.top - POPOVER_GAP : rect.bottom + POPOVER_GAP,
      placement,
      width,
    })
  }, [])

  React.useEffect(() => {
    if (!open) {
      setPopoverPos(null)
      return
    }
    updatePopoverPos()
    const onResize = () => updatePopoverPos()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open, updatePopoverPos])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (rootRef.current?.contains(t)) return
      if (popoverRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const state = open ? 'open' : hover ? 'hover' : 'closed'

  return (
    <div ref={rootRef} className={cx('relative mx-auto h-52 w-56 overflow-visible', className)}>
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open && popoverPos ? (
                <div
                  style={{
                    position: 'fixed',
                    left: popoverPos.left,
                    width: popoverPos.width,
                    zIndex: 80,
                    ...(popoverPos.placement === 'above'
                      ? { bottom: window.innerHeight - popoverPos.anchorTop }
                      : { top: popoverPos.anchorTop }),
                  }}
                >
                  <motion.div
                    ref={popoverRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Banco de ideas"
                    initial={{
                      opacity: 0,
                      y: popoverPos.placement === 'above' ? 10 : -10,
                      scale: 0.96,
                    }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: popoverPos.placement === 'above' ? 6 : -6,
                      scale: 0.98,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--color-accent-500)_40%,transparent)]"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-separator-border px-4 py-3">
                      <div>
                        <p className="text-caption-1-semibold text-text-primary">Banco de ideas</p>
                        <p className="text-[11px] text-text-tertiary">
                          {ideas.length === 0
                            ? 'Vacío — genera y guarda ideas'
                            : `${ideas.length} idea${ideas.length === 1 ? '' : 's'}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex size-8 items-center justify-center rounded-full text-foreground-icon-tertiary outline-none transition hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                        aria-label="Cerrar"
                        onClick={() => setOpen(false)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                      {ideas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-text-tertiary">
                          <Lightbulb className="size-6 text-accent-500" />
                          <p className="text-center text-caption-1-regular">
                            Todavía no hay ideas guardadas
                          </p>
                        </div>
                      ) : (
                        <ul className="flex flex-col gap-1.5">
                          {ideas.map((idea) => (
                            <li key={idea.id}>
                              <button
                                type="button"
                                className="w-full rounded-2xl border border-transparent bg-background-secondary-default px-3 py-2.5 text-left outline-none transition hover:border-border-button-hover hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                                onClick={() => {
                                  onSelectIdea?.(idea)
                                  setOpen(false)
                                }}
                              >
                                <p className="line-clamp-2 text-caption-1-semibold text-text-primary">
                                  {idea.hook}
                                </p>
                                {(idea.angle || idea.why) && (
                                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-text-secondary">
                                    {idea.angle || idea.why}
                                  </p>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="border-t border-separator-border p-2">
                      <button
                        type="button"
                        className="w-full rounded-2xl bg-accent-500 px-3 py-2.5 text-caption-1-semibold text-white outline-none transition hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                        onClick={() => {
                          setOpen(false)
                          onOpenBank()
                        }}
                      >
                        Abrir banco completo
                      </button>
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      <div className="group relative h-full w-full overflow-visible" style={{ perspective: '1200px' }}>
        <div
          className="pointer-events-none absolute -bottom-10 left-6 right-6 h-6 rounded-full bg-accent-700/35 blur-3xl transition-transform duration-700 group-hover:scale-x-110"
          style={{ transform: 'rotateX(90deg) translateZ(-80px)' }}
          aria-hidden
        />

        <motion.div
          className="relative h-full w-full cursor-pointer overflow-visible"
          variants={folderBody}
          initial="closed"
          animate={state}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          onClick={() => setOpen((v) => !v)}
          style={{ transformStyle: 'preserve-3d' }}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-label="Abrir banco de ideas"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen((v) => !v)
            }
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(-20px)',
              background:
                'radial-gradient(circle at 50% 0%, color-mix(in oklab, var(--color-accent-400) 55%, transparent) 0%, var(--color-accent-700) 55%, var(--color-accent-950) 100%)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.35), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.1), inset 0 -2px 8px color-mix(in oklab, var(--color-accent-950) 55%, transparent), inset 0 0 40px color-mix(in oklab, var(--color-accent-500) 25%, transparent), 0 25px 50px -12px color-mix(in oklab, var(--color-accent-500) 45%, transparent)',
              border: '1px solid color-mix(in oklab, var(--color-accent-200) 35%, transparent)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.14] mix-blend-overlay"
              style={{ backgroundImage: NOISE }}
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-accent-950/90 via-accent-800/35 to-transparent opacity-70" />
          </div>

          {/* Papers sit behind the lid and rise on hover/open */}
          <div
            className="pointer-events-none absolute inset-x-4 bottom-5 top-[-28px] overflow-visible"
            style={{ transformStyle: 'preserve-3d', zIndex: 10 }}
          >
            {[2, 1, 0].map((layer) => {
              const idea = papers[2 - layer]
              const closedY = -36 - layer * 5
              const hoverY = -62 - layer * 7
              const openY = -54 - layer * 6
              return (
                <motion.div
                  key={layer}
                  initial={false}
                  animate={{
                    y: state === 'closed' ? closedY : state === 'hover' ? hoverY : openY,
                    rotate: state === 'closed' ? (layer - 1) * 1.5 : (layer - 1) * 3.5,
                    scale: 0.96,
                  }}
                  transition={{ type: 'spring', stiffness: 150, damping: 18, mass: 0.85 }}
                  className="absolute inset-x-0 bottom-0 flex h-36 flex-col overflow-hidden rounded-xl p-3"
                  style={{
                    transformOrigin: 'bottom center',
                    zIndex: 5 - layer,
                    background:
                      'linear-gradient(to bottom, var(--color-background-primary-default) 0%, var(--color-background-secondary-default) 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.85)',
                    borderLeft: '1px solid rgba(255,255,255,0.4)',
                    borderRight: '1px solid rgba(255,255,255,0.4)',
                    boxShadow:
                      'inset 0 0 20px rgba(255,255,255,0.45), 0 4px 12px -4px color-mix(in oklab, var(--color-accent-500) 18%, transparent)',
                  }}
                >
                  {idea ? (
                    <div className="relative z-10 min-h-0 flex-1">
                      <p className="line-clamp-3 text-caption-1-semibold text-text-primary">
                        {idea.hook}
                      </p>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 text-text-tertiary">
                      <Lightbulb className="size-5 text-accent-500" />
                      <p className="text-center text-caption-1-regular">Banco vacío</p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-accent-500/5" />
                </motion.div>
              )
            })}
          </div>

          <motion.div
            variants={folderLid}
            className="absolute inset-0 z-20"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom' }}
          >
            <div
              className="absolute inset-x-0 bottom-0 h-[82%] overflow-hidden rounded-3xl"
              style={{
                background:
                  'linear-gradient(145deg, color-mix(in oklab, var(--color-accent-400) 42%, transparent) 0%, color-mix(in oklab, var(--color-accent-700) 88%, transparent) 55%, color-mix(in oklab, var(--color-accent-950) 92%, transparent) 100%)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.35), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.08), 0 -5px 24px color-mix(in oklab, var(--color-accent-500) 28%, transparent)',
                borderTop: '1px solid color-mix(in oklab, var(--color-accent-100) 40%, transparent)',
              }}
            >
              <div className="pointer-events-none absolute -inset-full translate-y-1/3 bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-y-0" />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
                style={{ backgroundImage: NOISE }}
              />
              <div className="absolute inset-x-0 bottom-3 flex justify-center">
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white/95 backdrop-blur-sm">
                  Banco · {ideas.length}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
