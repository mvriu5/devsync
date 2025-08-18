import { cn } from "@/lib/utils"
import React from "react"

interface LinkInputProps {
    domain: string
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function LinkInput({ domain, value, onValueChange, placeholder = "your-custom-link", className }: LinkInputProps) {
    return (
        <div
            className={cn(
                "group h-10 p-1 flex items-center border border-main rounded-xs overflow-hidden bg-primary",
                "focus-within:border-brand focus-within:outline focus-within:outline-brand/60 focus-within:bg-brand/5 transition-all",
                className,
            )}
        >
            <div className="h-full px-1 bg-secondary text-tertiary font-mono text-sm border-r border-main flex-shrink-0 rounded-xs flex items-center">
                {domain}
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                spellCheck={false}
                className={cn(
                    "flex-1 w-full rounded-xs outline-0 bg-primary px-2 py-2",
                    "shadow-md transition-colors file:border-0 text-secondary",
                    "file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-placeholder",
                    "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:bg-brand/5",
                    className
                )}
            />
        </div>
    )
}
