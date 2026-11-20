'use client'

import {
  useState,
  useId,
  useRef,
  useEffect,
  createContext,
  useContext,
  isValidElement,
  type ReactNode,
  type ComponentProps,
  type MouseEvent,
  type ElementType,
} from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variants,
} from 'motion/react'
import { useClickOutside } from '@/hooks/use-click-outside'
import { cx } from '@/utils/cx'

const TRANSITION: Transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.4,
}

type MorphingPopoverContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  uniqueId: string
  variants?: Variants
}

const MorphingPopoverContext = createContext<MorphingPopoverContextValue | null>(null)

function usePopoverLogic({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
} = {}) {
  const uniqueId = useId()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)

  const isOpen = controlledOpen ?? uncontrolledOpen

  const open = () => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(true)
    }
    onOpenChange?.(true)
  }

  const close = () => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(false)
    }
    onOpenChange?.(false)
  }

  return { isOpen, open, close, uniqueId }
}

export type MorphingPopoverProps = {
  children: ReactNode
  transition?: Transition
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variants?: Variants
  className?: string
} & ComponentProps<'div'>

function MorphingPopover({
  children,
  transition = TRANSITION,
  defaultOpen,
  open,
  onOpenChange,
  variants,
  className,
  ...props
}: MorphingPopoverProps) {
  const popoverLogic = usePopoverLogic({ defaultOpen, open, onOpenChange })

  return (
    <MorphingPopoverContext.Provider value={{ ...popoverLogic, variants }}>
      <MotionConfig transition={transition}>
        <div
          className={cx('relative', className)}
          key={popoverLogic.uniqueId}
          {...props}
        >
          {children}
        </div>
      </MotionConfig>
    </MorphingPopoverContext.Provider>
  )
}

export type MorphingPopoverTriggerProps = {
  asChild?: boolean
  children: ReactNode
  className?: string
} & ComponentProps<typeof motion.button>

function MorphingPopoverTrigger({
  children,
  className,
  asChild = false,
  ...props
}: MorphingPopoverTriggerProps) {
  const context = useContext(MorphingPopoverContext)
  if (!context) {
    throw new Error('MorphingPopoverTrigger must be used within MorphingPopover')
  }

  if (asChild && isValidElement(children)) {
    const MotionComponent = motion.create(children.type as ElementType)
    const childProps = children.props as Record<string, unknown>

    return (
      <MotionComponent
        {...childProps}
        onClick={(e: MouseEvent) => {
          const original = childProps.onClick as ((ev: MouseEvent) => void) | undefined
          original?.(e)
          context.open()
        }}
        layoutId={`popover-trigger-${context.uniqueId}`}
        className={childProps.className as string | undefined}
        key={context.uniqueId}
        aria-expanded={context.isOpen}
        aria-controls={`popover-content-${context.uniqueId}`}
      />
    )
  }

  return (
    <motion.div
      key={context.uniqueId}
      layoutId={`popover-trigger-${context.uniqueId}`}
      onClick={context.open}
    >
      <motion.button
        type="button"
        {...props}
        layoutId={`popover-label-${context.uniqueId}`}
        key={context.uniqueId}
        className={className}
        aria-expanded={context.isOpen}
        aria-controls={`popover-content-${context.uniqueId}`}
      >
        {children}
      </motion.button>
    </motion.div>
  )
}

export type MorphingPopoverContentProps = {
  children: ReactNode
  className?: string
} & ComponentProps<typeof motion.div>

function MorphingPopoverContent({
  children,
  className,
  ...props
}: MorphingPopoverContentProps) {
  const context = useContext(MorphingPopoverContext)
  if (!context) {
    throw new Error('MorphingPopoverContent must be used within MorphingPopover')
  }

  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, context.close)

  useEffect(() => {
    if (!context.isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') context.close()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [context.isOpen, context.close])

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          {...props}
          ref={ref}
          layoutId={`popover-trigger-${context.uniqueId}`}
          key={context.uniqueId}
          id={`popover-content-${context.uniqueId}`}
          role="dialog"
          aria-modal="true"
          className={cx(
            'absolute z-50 overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default p-3 text-text-primary shadow-lg',
            className,
          )}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={context.variants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent }
