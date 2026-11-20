'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    color?: string
  }
>

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('useChart must be used within ChartContainer')
  return ctx
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}) {
  const id = React.useId().replace(/:/g, '')
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={id}
        className={cn('flex aspect-video justify-center text-caption-1-regular text-text-tertiary', className)}
        {...props}
      >
        <style>{`
          [data-chart="${id}"] {
            ${Object.entries(config)
              .map(([key, item], i) =>
                item.color ? `--color-${key}: ${item.color}; --chart-${i + 1}: ${item.color};` : '',
              )
              .join('\n')}
          }
        `}</style>
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

export { useChart }
