import { useMemo } from 'react'
import { motion } from 'motion/react'
import { cx } from '@/utils/cx'
import { TextShimmerWave } from '@/components/application/text-shimmer-wave/text-shimmer-wave'

/** Accent ramp (matches theme.css) — keyframed RGB for the wave. */
const ACCENT = {
  light: { lo: [221, 217, 255] as const, hi: [18, 0, 173] as const, ball: 'bg-accent-900' },
  dark: { lo: [6, 0, 61] as const, hi: [221, 217, 255] as const, ball: 'bg-accent-100' },
}

export type WavePhysicsLoaderProps = {
  theme?: 'light' | 'dark'
  /** Visual scale — sm for cards, md default, lg hero. */
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function WavePhysicsLoader({
  theme = 'light',
  size = 'md',
  label,
  className,
}: WavePhysicsLoaderProps) {
  const numBars = 15
  const barWidth = 12
  const barGap = 8
  const barTotalWidth = barWidth + barGap

  const numFrames = 201
  const B = 4
  const maxBounce = 60
  const baseBarH = 16
  const wavePeakH = 48

  const { bars, ballX, ballY, ballScaleX, ballScaleY, times } = useMemo(() => {
    const palette = ACCENT[theme]
    const barsData = Array.from({ length: numBars }).map(() => ({
      heights: [] as string[],
      colors: [] as string[],
    }))
    const bX: string[] = []
    const bY: string[] = []
    const bScaleX: number[] = []
    const bScaleY: number[] = []
    const tArr: number[] = []

    for (let k = 0; k < numFrames; k++) {
      const t = k / (numFrames - 1)
      tArr.push(t)

      const x_frac = t < 0.5 ? t / 0.5 : (1 - t) / 0.5
      const ball_idx = x_frac * (numBars - 1)

      bX.push(`${ball_idx * barTotalWidth}px`)

      let bounce_f = (x_frac * B) % 1.0
      if (x_frac === 1 || x_frac === 0) bounce_f = 0

      const bounce_h = 4 * bounce_f * (1 - bounce_f)
      const height_factor = Math.max(0, 1 - bounce_h * 2)

      const ball_indent = height_factor * 20
      const ball_y = baseBarH + wavePeakH - ball_indent + bounce_h * maxBounce
      bY.push(`-${ball_y}px`)

      const squish = height_factor
      bScaleY.push(1 - squish * 0.3)
      bScaleX.push(1 + squish * 0.25)

      for (let i = 0; i < numBars; i++) {
        const dist = Math.abs(i - ball_idx)

        let wave_val = 0
        if (dist < 3) {
          wave_val = Math.cos((dist / 3) * (Math.PI / 2))
        }

        let indent = 0
        if (dist < 1.5) {
          const indent_dist = Math.cos((dist / 1.5) * (Math.PI / 2))
          indent = indent_dist * height_factor * 20
        }

        const bar_h = baseBarH + wave_val * wavePeakH - indent
        barsData[i].heights.push(`${Math.max(4, bar_h)}px`)

        const [r0, g0, b0] = palette.lo
        const [r1, g1, b1] = palette.hi
        const r = Math.round(r0 + wave_val * (r1 - r0))
        const g = Math.round(g0 + wave_val * (g1 - g0))
        const b = Math.round(b0 + wave_val * (b1 - b0))
        barsData[i].colors.push(`rgb(${r}, ${g}, ${b})`)
      }
    }

    return {
      bars: barsData,
      ballX: bX,
      ballY: bY,
      ballScaleX: bScaleX,
      ballScaleY: bScaleY,
      times: tArr,
    }
  }, [theme])

  const scaleClass =
    size === 'sm'
      ? 'scale-[0.35]'
      : size === 'lg'
        ? 'scale-[0.7] sm:scale-90 md:scale-100'
        : 'scale-[0.5] sm:scale-[0.65] md:scale-75'

  const loRgb = ACCENT[theme].lo

  return (
    <div
      className={cx('flex flex-col items-center justify-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Cargando'}
    >
      <div className={cx('relative flex w-full flex-col items-center justify-center', scaleClass)}>
        <div className="relative flex h-48 w-[292px] items-end justify-start space-x-2">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-3 origin-bottom rounded-full"
              style={{
                height: '16px',
                backgroundColor: `rgb(${loRgb[0]}, ${loRgb[1]}, ${loRgb[2]})`,
              }}
              animate={{
                height: bar.heights,
                backgroundColor: bar.colors,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times,
                ease: 'linear',
              }}
            />
          ))}

          <motion.div
            className={cx(
              'absolute z-10 size-3 rounded-full shadow-sm',
              ACCENT[theme].ball,
            )}
            style={{ bottom: 0, left: 0, transformOrigin: 'bottom center' }}
            animate={{
              x: ballX,
              y: ballY,
              scaleX: ballScaleX,
              scaleY: ballScaleY,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              times,
              ease: 'linear',
            }}
          />
        </div>
      </div>
      {label ? (
        <TextShimmerWave text={label} className="text-caption-1-semibold" />
      ) : (
        <span className="sr-only">Cargando</span>
      )}
    </div>
  )
}
