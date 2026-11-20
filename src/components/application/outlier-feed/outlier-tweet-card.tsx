import {
  RiExternalLinkLine,
  RiHeartLine,
  RiRepeatLine,
  RiSparkling2Line,
} from '@remixicon/react'
import { Avatar } from '@/components/base/avatar/avatar'
import { Button } from '@/components/ui/button'
import { SquareSnake } from '@/components/application/square-snake/square-snake'
import type { OutlierTweet } from '@/lib/types'
import { cx } from '@/utils/cx'

function initialsFromHandle(handle: string): string {
  const clean = handle.replace(/^@/, '').trim()
  if (!clean) return '?'
  return clean.slice(0, 2).toUpperCase()
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return n.toLocaleString('es-ES')
}

export type OutlierTweetCardProps = {
  tweet: OutlierTweet
  mock?: boolean
  inspiring?: boolean
  onInspire?: () => void
  className?: string
}

export function OutlierTweetCard({
  tweet,
  mock,
  inspiring,
  onInspire,
  className,
}: OutlierTweetCardProps) {
  const handle = tweet.handle.replace(/^@/, '')
  const viral = tweet.viralityScore
  const isOutlier = tweet.isOutlier || (typeof viral === 'number' && viral >= 55)

  return (
    <article
      className={cx(
        'flex gap-3 px-4 py-4 transition-colors hover:bg-background-secondary-hover/40',
        className,
      )}
    >
      <Avatar
        size="lg"
        color="neutral"
        initials={initialsFromHandle(handle)}
        alt={`@${handle}`}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-body-semibold text-text-primary">@{handle}</span>
          {isOutlier ? (
            <span className="rounded-full bg-accent-50 px-2 py-0.5 text-caption-1-semibold text-accent-800">
              Destacado
              {typeof viral === 'number' ? ` · ${viral}` : ''}
            </span>
          ) : typeof viral === 'number' ? (
            <span className="rounded-full bg-background-secondary-default px-2 py-0.5 text-caption-1-semibold text-text-secondary">
              {viral}
            </span>
          ) : null}
          {mock ? (
            <span className="rounded-full border border-border-button-default px-2 py-0.5 text-caption-1-semibold text-text-tertiary">
              Ejemplo
            </span>
          ) : null}
        </div>

        <p className="whitespace-pre-wrap text-body-regular text-text-primary">{tweet.text}</p>

        <div className="flex flex-wrap items-center gap-4 text-caption-1-regular text-text-tertiary">
          <span className="inline-flex items-center gap-1">
            <RiHeartLine className="size-3.5 text-foreground-icon-quaternary" aria-hidden />
            {formatCount(tweet.likes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <RiRepeatLine className="size-3.5 text-foreground-icon-quaternary" aria-hidden />
            {formatCount(tweet.retweets)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {onInspire ? (
            <Button
              type="button"
              variant="glossy"
              size="sm"
              className="gap-1.5"
              disabled={inspiring}
              onClick={onInspire}
            >
              {inspiring ? (
                <SquareSnake size="sm" className="brightness-200" />
              ) : (
                <RiSparkling2Line className="size-3.5" />
              )}
              {inspiring ? 'Creando…' : 'Crear a partir de esto'}
            </Button>
          ) : null}
          {tweet.url ? (
            <Button type="button" variant="outline" size="sm" className="gap-1.5" asChild>
              <a href={tweet.url} target="_blank" rel="noreferrer">
                <RiExternalLinkLine className="size-3.5" />
                Ver original
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
