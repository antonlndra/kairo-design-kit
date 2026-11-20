import { useState } from 'react'
import {
  RiAddLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiHeartLine,
  RiPlaneLine,
  RiSparklingLine,
  RiSunLine,
  RiShoppingCart2Line,
} from '@remixicon/react'
import { Avatar } from '@/components/base/avatar/avatar'
import { Badge } from '@/components/base/badges/badge'
import { Chip } from '@/components/base/badges/chip'
import { Button } from '@/components/base/buttons/button'
import { Checkbox } from '@/components/base/checkbox/checkbox'
import { Divider } from '@/components/base/divider/divider'
import { Input } from '@/components/base/input/input'
import { Kbd } from '@/components/base/kbd/kbd'
import { Pagination } from '@/components/base/pagination/pagination'
import { Switch } from '@/components/base/switch/switch'
import { Tab, TabList, TabPanel, Tabs } from '@/components/base/tabs/tabs'
import { Announcement } from '@/components/base/announcement/announcement'
import { AgentThinking } from '@/components/application/agent-thinking/agent-thinking'
import { CalendarCardFan } from '@/components/application/calendar-card-fan/calendar-card-fan'
import { ComposerLoader } from '@/components/application/composer-loader/composer-loader'
import { GlassAppDock } from '@/components/application/glass-app-dock/glass-app-dock'
import { IdeasGlassFolder } from '@/components/application/ideas-glass-folder/ideas-glass-folder'
import { MonoRoundedGaugeArc } from '@/components/application/mono-rounded-gauge-arc/mono-rounded-gauge-arc'
import { MorphCopyButton } from '@/components/application/morph-copy-button/morph-copy-button'
import { NumberPop } from '@/components/application/number-pop/number-pop'
import { OutlierTweetCard } from '@/components/application/outlier-feed/outlier-tweet-card'
import { SquareSnake } from '@/components/application/square-snake/square-snake'
import { TextMorph } from '@/components/application/text-morph/text-morph'
import { TextShimmerWave } from '@/components/application/text-shimmer-wave/text-shimmer-wave'
import { ThemeToggle } from '@/components/application/theme/theme-toggle'
import { WavePhysicsLoader } from '@/components/application/wave-physics-loader/wave-physics-loader'
import type { IdeaCandidate, OutlierTweet } from '@/lib/types'
import { cx } from '@/utils/cx'

/* ------------------------------------------------------------------ layout */

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-caption-1-semibold uppercase tracking-[0.14em] text-accent-700">
          {eyebrow}
        </p>
        <h2 className="text-title-1-semibold text-text-primary">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-body-regular text-text-secondary">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

function Panel({
  title,
  hint,
  className,
  children,
}: {
  title: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-xs',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-body-semibold text-text-primary">{title}</h3>
        {hint ? <span className="text-caption-1-regular text-text-tertiary">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span
        className="h-12 w-full rounded-xl border border-black/5"
        style={{ background: value }}
      />
      <span className="truncate text-caption-1-semibold text-text-primary">{name}</span>
      <span className="truncate font-mono text-[11px] text-text-tertiary">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------- demos */

const FAN_ITEMS = [
  { id: '1', title: 'Llamada con Ana', meta: 'Hoy · 10:00', tone: 'blue' as const, icon: RiCalendarLine },
  { id: '2', title: 'Vuelo a Madrid', meta: 'Vie · 18:30', tone: 'purple' as const, icon: RiPlaneLine },
  { id: '3', title: 'Cena de equipo', meta: 'Sáb · 21:00', tone: 'pink' as const, icon: RiHeartLine },
  { id: '4', title: 'Compra semanal', meta: 'Dom · 12:00', tone: 'lime' as const, icon: RiShoppingCart2Line },
  { id: '5', title: 'Día libre', meta: 'Lun · todo el día', tone: 'yellow' as const, icon: RiSunLine },
]

const TWEET: OutlierTweet = {
  id: 't-1',
  author: 'Marta Ríos',
  handle: '@martarios',
  text: 'Nadie te enseña a vender sin sentir que estás vendiendo. Este es el guion que uso desde hace 3 años.',
  hook: 'Nadie te enseña a vender sin sentir que estás vendiendo.',
  likes: 4820,
  retweets: 612,
  engagement: 5.4,
  url: '#',
  isOutlier: true,
  viralityScore: 87,
  source: 'rival',
}

const IDEAS: IdeaCandidate[] = [
  {
    id: 'i-1',
    title: 'El error que nadie confiesa al empezar',
    hook: 'Empecé mal. Y esos 3 errores me costaron un año.',
    angle: 'Contraintuitivo',
    formato: 'Hilo',
    pilar: 'Marca personal',
    why: 'Un outlier del nicho mezcla confesión + lista corta.',
    jugada: 'original',
    sources: [],
    viralityScore: 92,
  },
  {
    id: 'i-2',
    title: 'Cómo escribir un hook en 20 segundos',
    hook: 'Tu primer tweet tiene 1,7 segundos para existir.',
    angle: 'Práctico',
    formato: 'Tweet',
    pilar: 'Copywriting',
    why: 'Formato accionable con un número concreto.',
    jugada: 'reempaquetar',
    sources: [],
    viralityScore: 78,
  },
  {
    id: 'i-3',
    title: 'Lo que aprendí de 100 entrevistas',
    hook: 'Hice 100 entrevistas y solo 4 preguntas importaban.',
    angle: 'Autoridad',
    formato: 'Carrusel',
    pilar: 'Proceso',
    why: 'Especificidad + curiosidad abre el hilo.',
    jugada: 'original',
    sources: [],
    viralityScore: 85,
  },
]

function Gallery() {
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState(3)
  const [dockId, setDockId] = useState('calendar')
  const [publishing, setPublishing] = useState(false)

  return (
    <div className="kairo-ambient min-h-dvh bg-background-full text-text-secondary">
      <header className="sticky top-0 z-40 border-b border-separator-border bg-background-primary-default/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
          <a href="#top" className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="size-8" />
            <span className="text-body-semibold text-text-primary">Kairo UI</span>
            <Chip color="blue" variant="caption">design kit</Chip>
          </a>
          <nav className="hidden items-center gap-5 text-body-medium md:flex">
            <a className="text-text-secondary hover:text-text-primary" href="#fundamentos">Fundamentos</a>
            <a className="text-text-secondary hover:text-text-primary" href="#base">Base</a>
            <a className="text-text-secondary hover:text-text-primary" href="#movimiento">Movimiento</a>
            <a className="text-text-secondary hover:text-text-primary" href="#aplicacion">Aplicación</a>
          </nav>
          <ThemeToggle appearance="segmented" />
        </div>
      </header>

      <main id="top" className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-14">
        {/* Hero */}
        <section className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1 text-caption-1-medium text-text-secondary shadow-xs">
            <RiSparklingLine className="size-3.5 text-accent-500" aria-hidden />
            Sistema visual · React + Tailwind v4
          </span>
          <h1 className="max-w-3xl text-display-2-semibold tracking-tight text-text-primary">
            Un kit para copiar el <span className="text-accent-600">diseño</span>, no el producto.
          </h1>
          <p className="max-w-2xl text-body-2-regular text-text-secondary">
            Tokens, tipografía, componentes base y piezas de interfaz. Sin backend, sin claves,
            sin datos de clientes. Todo lo que hay aquí es estático y reutilizable.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              leadingIcon={RiArrowRightLine}
              onClick={() =>
                document.getElementById('aplicacion')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Ver componentes
            </Button>
            <Button variant="secondary" leadingIcon={RiAddLine}>Añadir idea</Button>
            <Button variant="ghost">Ver tokens</Button>
          </div>
          <div className="grid w-full gap-4 pt-4 sm:grid-cols-3">
            {[
              ['50+', 'componentes'],
              ['1', 'sistema de tokens'],
              ['0', 'dependencias de servidor'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-border-button-default bg-background-primary-default p-4 shadow-xs"
              >
                <p className="text-title-2-semibold text-text-primary">
                  <NumberPop value={value} />
                </p>
                <p className="text-caption-1-regular text-text-tertiary">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Foundations */}
        <Section
          id="fundamentos"
          eyebrow="Fundamentos"
          title="Color y tipografía"
          description="La rampa accent se puede retematizar entera cambiando variables CSS. Los textos usan escalas con nombre, no tamaños sueltos."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Accent" hint="--color-accent-*">
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-9">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800].map((step) => (
                  <Swatch
                    key={step}
                    name={String(step)}
                    value={`var(--color-accent-${step})`}
                  />
                ))}
              </div>
              <Divider variant="fill" className="text-caption-1-regular">
                #1A00FF · accent-500
              </Divider>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Swatch name="superficie" value="var(--color-background-primary-default)" />
                <Swatch name="superficie 2" value="var(--color-background-secondary-default)" />
                <Swatch name="borde" value="var(--color-border-button-default)" />
                <Swatch name="separador" value="var(--color-separator-border)" />
              </div>
            </Panel>
            <Panel title="Tipografía" hint="Inter · Instrument Serif · JetBrains Mono">
              <div className="flex flex-col gap-3">
                <p className="text-display-3-semibold text-text-primary">Display 3</p>
                <p className="text-title-1-semibold text-text-primary">Title 1 semibold</p>
                <p className="text-headline-medium text-text-primary">Headline medium</p>
                <p className="text-body-regular text-text-secondary">
                  Body regular. Texto de interfaz con line-height cómodo y tracking neutro.
                </p>
                <p className="text-caption-1-regular text-text-tertiary">Caption 1 · metadatos</p>
                <p className="font-serif text-title-2-regular text-text-primary">
                  Instrument Serif para acentos editoriales.
                </p>
                <p className="font-mono text-body-2-regular text-text-secondary">
                  JetBrains Mono · 0123456789 · tabular
                </p>
              </div>
              <Divider variant="double">Escala</Divider>
              <div className="flex flex-wrap items-center gap-2 text-caption-1-medium text-text-secondary">
                <Kbd>⌘</Kbd><Kbd>K</Kbd>
                <span className="px-2">atajos</span>
                <Kbd>Esc</Kbd>
              </div>
            </Panel>
          </div>
        </Section>

        {/* Base components */}
        <Section
          id="base"
          eyebrow="Componentes base"
          title="La caja de herramientas"
          description="Botones, campos, selección, navegación y feedback. Construidos sobre react-aria, con estados de foco y teclado incluidos."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Botones" hint="primary · secondary · ghost · danger">
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primario</Button>
                <Button variant="secondary">Secundario</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Eliminar</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="small" leadingIcon={RiAddLine}>Small</Button>
                <Button size="small" variant="secondary">Small 2</Button>
                <Button size="xs" variant="secondary">XS</Button>
                <Button iconOnly leadingIcon={RiAddLine} aria-label="Añadir" />
                <Button iconOnly variant="secondary" leadingIcon={RiArrowRightLine} aria-label="Siguiente" />
              </div>
            </Panel>

            <Panel title="Formulario" hint="react-aria">
              <Input label="Nombre" placeholder="Ana García" />
              <Input label="Email" type="email" placeholder="ana@ejemplo.com" hint="Nunca compartimos tu correo." />
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <Checkbox defaultSelected>Recordarme</Checkbox>
                <Switch defaultSelected>Notificaciones</Switch>
              </div>
            </Panel>

            <Panel title="Etiquetas y avatares" hint="badge · chip · avatar">
              <div className="flex flex-wrap items-center gap-2">
                <Chip color="lime">Publicado</Chip>
                <Chip color="rose">Error</Chip>
                <Chip color="yellow">Pendiente</Chip>
                <Chip color="cyan">Programado</Chip>
                <Chip color="purple">Borrador</Chip>
                <Chip color="neutral" variant="subtle">Neutro</Chip>
                <Chip color="soft" variant="caption">Soft</Chip>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Avatar initials="A" color="neutral" />
                <Avatar initials="S" color="blue" />
                <Avatar initials="L" color="lime" />
                <Avatar initials="P" color="pink" />
                <span className="flex items-center gap-2 text-body-medium text-text-secondary">
                  <Avatar size="sm" initials="K" color="blue" /> Equipo
                  <Badge color="primary">3</Badge>
                </span>
              </div>
            </Panel>

            <Panel title="Tabs" hint="accesible con teclado">
              <Tabs aria-label="Ejemplo de pestañas">
                <TabList aria-label="Vistas">
                  <Tab id="semana">Semana</Tab>
                  <Tab id="mes">Mes</Tab>
                  <Tab id="lista">Lista</Tab>
                </TabList>
                <TabPanel id="semana" className="pt-2 text-body-regular text-text-secondary">
                  Vista semanal del calendario editorial.
                </TabPanel>
                <TabPanel id="mes" className="pt-2 text-body-regular text-text-secondary">
                  Vista mensual para planificar por bloques.
                </TabPanel>
                <TabPanel id="lista" className="pt-2 text-body-regular text-text-secondary">
                  Lista plana con filtros y orden.
                </TabPanel>
              </Tabs>
              <Divider variant="fill">o usa el paginador</Divider>
              <Pagination page={page} totalPages={12} onChange={setPage} />
            </Panel>

            <Panel title="Anuncio" hint="descartable">
              <Announcement
                title="Tu semana está lista"
                description="Hemos preparado 7 borradores con tu voz. Revísalos antes de programar."
                actionLabel="Revisar borradores"
                onAction={() => undefined}
                dismissible
                closeLabel="Cerrar"
              />
            </Panel>

            <Panel title="Separadores" hint="single · double · fill">
              <Divider>Contenido</Divider>
              <Divider variant="double">Doble línea</Divider>
              <Divider variant="fill">Banda suave</Divider>
            </Panel>
          </div>
        </Section>

        {/* Motion */}
        <Section
          id="movimiento"
          eyebrow="Movimiento"
          title="Loaders y microinteracciones"
          description="Estados de espera con personalidad. Todos respetan prefers-reduced-motion."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Panel title="Agent thinking" hint="wave · spin · stars · infinity">
              <div className="flex flex-col gap-4">
                <AgentThinking variant="wave" label="Pensando" />
                <AgentThinking variant="spin" label="Buscando fuentes" />
                <AgentThinking variant="stars" label="Destilando" />
                <AgentThinking variant="infinity" label="Escribiendo" showTimer />
              </div>
            </Panel>

            <Panel title="Wave physics" hint="light · dark">
              <div className="flex flex-col items-center gap-4">
                <WavePhysicsLoader theme="light" label="Generando semana" />
                <div className="w-full rounded-2xl bg-neutral-925 p-4">
                  <WavePhysicsLoader theme="dark" />
                </div>
              </div>
            </Panel>

            <Panel title="Otros estados">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <SquareSnake size="md" />
                  <span className="text-body-medium text-text-primary">Cargando ideas</span>
                </div>
                <TextShimmerWave text="Conectando con tu cerebro…" />
                <div className="flex items-center gap-3">
                  <MonoRoundedGaugeArc score={7.8} label="Nota de fuerza" className="w-full" />
                </div>
              </div>
            </Panel>

            <Panel title="Composer loader" hint="borde luminoso" className="md:col-span-2">
              <ComposerLoader active>
                <div className="rounded-2xl bg-transparent px-4 py-3 text-body-regular text-text-tertiary shadow-none">
                  Escribe una idea o pega un enlace…
                </div>
              </ComposerLoader>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <MorphCopyButton
                  copied={copied}
                  tone="accent"
                  onCopy={() => {
                    setCopied(true)
                    window.setTimeout(() => setCopied(false), 1600)
                  }}
                />
                <MorphCopyButton copied={copied} onCopy={() => setCopied(true)} />
                <Button
                  variant="secondary"
                  onClick={() => setPublishing((v) => !v)}
                >
                  <TextMorph>{publishing ? 'Publicando…' : 'Publicar'}</TextMorph>
                </Button>
              </div>
            </Panel>

            <Panel title="Números" hint="cambio animado">
              <div className="flex items-end gap-6">
                <p className="text-title-1-semibold tabular-nums text-text-primary">
                  <NumberPop value={4820} />
                </p>
                <p className="text-headline-medium tabular-nums text-accent-600">
                  <NumberPop value="+12,4%" />
                </p>
              </div>
            </Panel>
          </div>
        </Section>

        {/* Application components */}
        <Section
          id="aplicacion"
          eyebrow="Aplicación"
          title="Piezas de producto"
          description="Los componentes con más carácter del producto: docks de cristal, tarjetas de calendario, folders de ideas y ajustes."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Glass app dock" hint="navegación flotante">
              <div className="flex min-h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-50 via-background-secondary-default to-accent-100 p-6">
                <GlassAppDock activeId={dockId} onSelect={setDockId} />
              </div>
            </Panel>

            <Panel title="Calendar card fan" hint="hover / click">
              <div className="flex min-h-72 items-center justify-center overflow-hidden">
                <CalendarCardFan items={FAN_ITEMS} trigger="hover" radius={120} compact />
              </div>
            </Panel>

            <Panel title="Outlier tweet" hint="feed de competencia">
              <div className="overflow-hidden rounded-2xl border border-border-button-default">
                <OutlierTweetCard tweet={TWEET} onInspire={() => undefined} />
              </div>
            </Panel>

            <Panel title="Ideas glass folder" hint="pulsa la carpeta">
              <div className="flex min-h-72 items-center justify-center">
                <IdeasGlassFolder ideas={IDEAS} onOpenBank={() => undefined} />
              </div>
            </Panel>

          </div>
        </Section>

        <footer className="flex flex-col gap-2 border-t border-separator-border py-8 text-caption-1-regular text-text-tertiary">
          <p>Kairo UI · design kit estático. Sin backend, sin credenciales, sin datos reales.</p>
          <p>Los iconos, tipografías y dependencias mantienen sus licencias originales.</p>
        </footer>
      </main>
    </div>
  )
}

export default Gallery
