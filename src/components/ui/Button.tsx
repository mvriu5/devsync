import {cva, type VariantProps} from "class-variance-authority"
import React from "react"
import {Slot} from "radix-ui"
import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center h-8 px-4 py-2 whitespace-nowrap transition-all rounded-xs shadow-md " +
    "text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                primary: "bg-primary hover:bg-secondary border border-main text-secondary hover:text-primary ",
                brand: "bg-brand/70 hover:bg-brand border border-brand/40 text-primary disabled:opacity-70",
                ghost: "bg-transparent hover:bg-secondary text-secondary hover:text-primary shadow-none",
                ghost_icon: "bg-transparent hover:bg-secondary text-secondary hover:text-primary px-2 shadow-none"
            }
        },
        defaultVariants: {
            variant: "primary"
        }
    }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = ({asChild, variant, className, ...props}: ButtonProps) => {
    const ButtonComponent = asChild ? Slot.Root : "button"

    return (
        <ButtonComponent
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        />
    )
}

export {
    Button,
    type ButtonProps
}