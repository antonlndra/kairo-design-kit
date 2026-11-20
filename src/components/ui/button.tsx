import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const depthShell =
  'depth-btn h-11 min-h-11 rounded-full border-0 bg-transparent p-0 px-[22px] text-[15px] font-medium shadow-none hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0 disabled:opacity-100'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline: cn(depthShell, 'depth-inset'),
        secondary: cn(depthShell, 'depth-inset'),
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        glossy: cn(depthShell, 'depth-glossy text-white'),
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: 'h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*="size-"])]:size-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': 'size-6 rounded-md [&_svg:not([class*="size-"])]:size-3',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        'glossy-icon': 'depth-icon size-11 min-h-11 min-w-11 rounded-[14px] p-0',
      },
    },
    compoundVariants: [
      {
        variant: ['glossy', 'outline', 'secondary'],
        size: 'sm',
        class: 'h-11 min-h-11 px-[22px]',
      },
      {
        variant: ['glossy', 'outline', 'secondary'],
        size: 'default',
        class: 'h-11 min-h-11 px-[22px]',
      },
      {
        variant: ['glossy', 'outline', 'secondary'],
        size: 'icon',
        class: 'depth-icon size-11 min-h-11 min-w-11 rounded-[14px] p-0',
      },
      {
        variant: 'glossy',
        size: 'glossy-icon',
        class: 'depth-icon size-11 min-h-11 min-w-11 rounded-[14px] p-0',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const DEPTH_VARIANTS = new Set(['glossy', 'outline', 'secondary'])

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'
  const depth = variant != null && DEPTH_VARIANTS.has(variant)

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {depth && !asChild ? <span className="depth-label">{children}</span> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
