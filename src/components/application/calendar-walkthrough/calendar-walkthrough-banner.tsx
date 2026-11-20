import * as React from 'react'
import { Calendar, Check, GraduationCap, Sparkles, Trash2, X } from 'lucide-react'
import { getLessonCompleted, setLessonCompleted } from '@/lib/lesson'
import { Button } from '@/components/ui/button'
import { TextMorph } from '@/components/application/text-morph/text-morph'
import { cx } from '@/utils/cx'

type SandboxTweet = {
  id: string
  hook: string
  body: string
}

const DEMO: SandboxTweet = {
  id: 'demo',
  hook: 'si tu oferta ya vale y tu feed no',
  body: 'no es un problema de diseño.\nes un problema de percepción.',
}

type Step = {
  id: string
  title: string
  body: string
  cta: string
  practice?: boolean
}

/** Pocos pasos, estilo Luma: enseñar sobre el producto real. */
const STEPS: Step[] = [
  {
    id: 'welcome',
    title: 'Bienvenido a Kairo',
    body: 'Aquí preparas la semana de tweets: Calendar, Coach y Reescribir.',
    cta: 'Siguiente',
  },
  {
    id: 'calendar',
    title: 'Tu semana abajo',
    body: 'Cada columna es un día. Abre un tweet para copiarlo, regenerarlo o marcarlo publicado.',
    cta: 'Siguiente',
  },
  {
    id: 'practice',
    title: 'Entrena el estilo',
    body: 'Me gusta / No me gusta enseña a Kairo. Eliminar quita el tweet de la cola.',
    cta: 'Siguiente',
    practice: true,
  },
  {
    id: 'tools',
    title: 'Coach y Reescribir',
    body: 'Coach afila una idea. Reescribir mejora un post que ya tienes escrito.',
    cta: 'Siguiente',
  },
  {
    id: 'done',
    title: 'Listo para publicar',
    body: 'Genera la semana, elige lo que sí, borra lo que no. Cuando quieras, Coach o Reescribir.',
    cta: 'Empezar',
  },
]

export function CalendarWalkthroughBanner({
  onFinished,
}: {
  onFinished?: () => void
}) {
  const [visible, setVisible] = React.useState(() => !getLessonCompleted())
  const [stepIndex, setStepIndex] = React.useState(0)
  const [practiced, setPracticed] = React.useState(false)
  const [flash, setFlash] = React.useState<'like' | 'dislike' | 'delete' | null>(null)
  const [demoGone, setDemoGone] = React.useState(false)

  if (!visible) return null

  const step = STEPS[stepIndex]
  const total = STEPS.length
  const canContinue = !step.practice || practiced

  const finish = () => {
    setLessonCompleted()
    setVisible(false)
    onFinished?.()
  }

  const goNext = () => {
    if (stepIndex >= total - 1) {
      finish()
      return
    }
    setStepIndex((i) => i + 1)
  }

  const markPracticed = (kind: 'like' | 'dislike' | 'delete') => {
    setPracticed(true)
    setFlash(kind)
    if (kind === 'delete') setDemoGone(true)
    window.setTimeout(() => setFlash(null), 700)
  }

  return (
    <section
      className="depth-surface overflow-hidden rounded-3xl border-0"
      aria-label="Guía de primeras veces"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-background-secondary-default sm:size-16"
          aria-hidden
        >
          {step.id === 'tools' ? (
            <GraduationCap className="size-7 text-accent-500" />
          ) : step.id === 'done' ? (
            <Sparkles className="size-7 text-accent-500" />
          ) : step.id === 'practice' ? (
            <Check className="size-7 text-accent-500" />
          ) : (
            <Calendar className="size-7 text-accent-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-title-3-semibold text-text-primary">
                <TextMorph>{step.title}</TextMorph>
              </h2>
              <p className="mt-1 max-w-xl text-body-regular text-text-secondary">
                <TextMorph>{step.body}</TextMorph>
              </p>
            </div>
            <button
              type="button"
              onClick={finish}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-tertiary outline-none transition-colors duration-150 hover:bg-background-secondary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              aria-label="Cerrar guía"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            className="mt-3 flex items-center gap-1.5"
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label={`Paso ${stepIndex + 1} de ${total}`}
          >
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={cx(
                  'h-1 w-6 rounded-full transition-colors duration-200 sm:w-8',
                  i <= stepIndex ? 'bg-text-primary' : 'bg-separator-border',
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-stretch">
          <div className="flex gap-2">
            {stepIndex > 0 ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              >
                Atrás
              </Button>
            ) : null}
            <Button
              type="button"
              variant="glossy"
              size="sm"
              className="cursor-pointer"
              disabled={!canContinue}
              onClick={goNext}
            >
              <TextMorph>{step.cta}</TextMorph>
            </Button>
          </div>
          {stepIndex < total - 1 ? (
            <button
              type="button"
              onClick={finish}
              className="min-h-11 cursor-pointer px-2 text-caption-1-semibold text-text-tertiary transition-colors duration-150 hover:text-text-secondary"
            >
              Saltar
            </button>
          ) : null}
        </div>
      </div>

      {step.practice ? (
        <div className="border-t border-separator-border bg-background-secondary-default px-4 py-4 sm:px-5">
          {demoGone ? (
            <p className="text-body-regular text-text-secondary">
              Eliminado. En el Calendar real pasa igual: el hueco queda libre.
            </p>
          ) : (
            <div className="depth-surface rounded-2xl border-0 p-4">
              <p className="whitespace-pre-wrap text-body-semibold text-text-primary">{DEMO.hook}</p>
              <p className="mt-1 whitespace-pre-wrap text-body-regular text-text-secondary">{DEMO.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cx(
                    'cursor-pointer',
                    flash === 'like' && 'text-accent-700',
                  )}
                  onClick={() => markPracticed('like')}
                >
                  <Check className="size-3.5" />
                  Me gusta
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cx(
                    'cursor-pointer',
                    flash === 'dislike' && 'text-text-error-primary',
                  )}
                  onClick={() => markPracticed('dislike')}
                >
                  <X className="size-3.5" />
                  No me gusta
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="cursor-pointer text-text-error-primary"
                  onClick={() => markPracticed('delete')}
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </Button>
              </div>
              {!practiced ? (
                <p className="mt-3 text-caption-1-regular text-text-tertiary">
                  Prueba una acción para continuar
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}
