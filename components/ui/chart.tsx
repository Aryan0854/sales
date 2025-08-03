"use client"

import * as React from "react"
import type * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: { color: CSS_COLOR_VALUE, ... } }
type ChartConfig = {
  [k: string]: {
    label?: string
    color?: string
    icon?: React.ComponentType
  }
}

type ChartContextProps = {
  config: ChartConfig
} & (
  | {
      initialData: RechartsPrimitive.AllSeriesType
      data?: never
    }
  | {
      data: RechartsPrimitive.AllSeriesType
      initialData?: never
    }
)

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    ChartContextProps & {
      children: React.ReactNode
    }
>(({ config, initialData, data, className, children, ...props }, ref) => {
  const uniqueId = React.useId()
  const id = `chart-${uniqueId}`
  return (
    <ChartContext.Provider
      value={{
        config,
        initialData: initialData || data,
        data: data || initialData,
      }}
    >
      <div
        data-chart={id}
        ref={ref}
        className={cn("flex aspect-video justify-center text-foreground", className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & React.HTMLAttributes<HTMLDivElement>
>(({ active, payload, className, ...props }, ref) => {
  const { config } = useChart()

  if (active && payload && payload.length) {
    return (
      <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-sm", className)} {...props}>
        {payload.map((item: any) => {
          const key = item.dataKey || item.name
          const content = config[key as keyof typeof config]

          return (
            <div key={item.dataKey} className="flex flex-1 items-center gap-2 p-1">
              {content?.icon && (
                <content.icon
                  className="h-3 w-3"
                  style={{
                    color: content.color,
                  }}
                />
              )}
              {content?.label ? (
                <p className="text-sm text-muted-foreground">{content.label}</p>
              ) : (
                <p className="text-sm text-muted-foreground">{key}</p>
              )}
              <div className="flex flex-1 items-center justify-end gap-2">
                <p className="font-medium text-foreground">{item.value.toLocaleString()}</p>
                {item.unit && <span className="text-sm text-muted-foreground">{item.unit}</span>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return null
})
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof ChartTooltip>>(
  ({ ...props }, ref) => {
    return (
      <ChartTooltip
        ref={ref}
        cursor={{
          stroke: "hsl(var(--border))",
          strokeWidth: 1,
          strokeDasharray: "10 10",
        }}
        {...props}
      />
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent, useChart }
