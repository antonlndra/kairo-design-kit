import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy } from 'lucide-react'
import { cx } from '@/utils/cx'

export type MorphCopyButtonProps = {
  label?: string
  copiedLabel?: string
  copied?: boolean
  onCopy: () => void | Promise<void>
  className?: string
  /** accent = glossy primary; soft = inset recessed */
  tone?: 'soft' | 'accent'
  /** Icon-only compact control (no text label). */
  iconOnly?: boolean
}

export function MorphCopyButton({
  label = 'Copiar',
  copiedLabel = 'Copiado',
  copied = false,
  onCopy,
  className,
  tone = 'soft',
  iconOnly = false,
}: MorphCopyButtonProps) {
  const [hovered, setHovered] = React.useState(false)
  const showCheck = copied || hovered
  const glossy = tone === 'accent'

  const body = (
    <>
      <div
        className="t-icon-swap relative flex size-4 shrink-0 items-center justify-center"
        data-state={showCheck ? 'b' : 'a'}
      >
        <span className="t-icon absolute inset-0 flex items-center justify-center" data-icon="a">
          <Copy className="size-3.5" />
        </span>
        <span className="t-icon absolute inset-0 flex items-center justify-center" data-icon="b">
          <Check className="size-3.5" />
        </span>
      </div>
      {!iconOnly && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'copied' : 'copy'}
            initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
            transition={{ duration: 0.15 }}
            className="ml-2.5 text-[13px] font-medium tracking-tight"
          >
            {copied ? copiedLabel : label}
          </motion.span>
        </AnimatePresence>
      )}
    </>
  )

  return (
    <motion.button
      type="button"
      onClick={() => void onCopy()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={undefined}
      whileTap={undefined}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
      className={cx(
        'relative inline-flex cursor-pointer items-center justify-center outline-none',
        glossy
          ? cx(
              'depth-btn depth-glossy border-0 text-white',
              iconOnly ? 'depth-icon size-11 p-0' : 'h-11 px-[22px]',
            )
          : cx(
              'depth-btn depth-inset border-0',
              iconOnly ? 'depth-icon size-11 p-0' : 'h-11 px-[22px]',
            ),
        className,
      )}
    >
      <span className="depth-label">{body}</span>
    </motion.button>
  )
}
