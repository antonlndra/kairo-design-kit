import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'accent' | 'muted' | 'outline'

const variants: Record<Variant, string> = {
  default: 'bg-foreground text-background',
  accent: 'bg-accent text-accent-foreground',
  muted: 'bg-muted text-muted-foreground border border-border',
  outline: 'border border-border text-foreground bg-transparent',
}

export function Badge({
  className,
  variant = 'muted',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
