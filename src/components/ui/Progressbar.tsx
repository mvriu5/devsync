import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    indicatorClassName?: string
}

const ProgressBar = React.forwardRef<React.ComponentRef<typeof ProgressPrimitive.Root>, ProgressBarProps>(({ indicatorClassName, className, value, ...props }, ref) => {
    return (
        <ProgressPrimitive.Root
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-primary shadow-sm border border-main",
                className
            )}
            ref={ref}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={cn(
                    "h-full w-full flex-1 bg-gradient-to-r from-brand/20 to-brand transition-all",
                    indicatorClassName
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
})
ProgressBar.displayName = ProgressPrimitive.Root.displayName

export { ProgressBar }