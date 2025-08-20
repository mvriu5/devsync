import React, {useState} from "react"
import {Input} from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import {ChevronDown, ChevronUp, X} from "lucide-react"

interface BadgeInputProps {
    values: string[]
    onValueChange: (values: string[]) => void
    placeholder: string
    className?: string
}

function BadgeInput({ values, onValueChange, placeholder, className }: BadgeInputProps) {
    const [inputValue, setInputValue] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)

    const handleAddBadge = () => {
        const v = inputValue.trim()
        if (!v) return

        if (values.includes(v)) {
            setInputValue("")
            return
        }

        onValueChange([...values, v])
        setInputValue("")
    }

    const handleRemoveBadge = (e: React.MouseEvent, todo: string) => {
        const updated = values.filter(item => item !== todo)
        onValueChange(updated)
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="group flex items-center pr-2 gap-2 flex items-center border border-main rounded-xs overflow-hidden bg-primary focus-within:border-brand focus-within:outline focus-within:outline-brand/60 focus-within:bg-brand/5 transition-all">
                <input
                    className={"h-8 flex-1 w-full rounded-xs outline-0 bg-primary px-2 shadow-md transition-colors file:border-0 text-secondary file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:bg-brand/5"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            e.preventDefault()
                            handleAddBadge()
                        }
                    }}
                />
                <Button
                    variant={"ghost"}
                    className={cn("hover:bg-0 group-focus:bg-brand/5 p-0", open && "rotate-180")}
                    type={"button"}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
            </div>


            <div className={"w-full flex flex-col gap-2"}>
                {open && values.map((badge, i) => (
                    <div key={i} className={"h-6 flex items-center justify-between gap-2 px-2 rounded-xs bg-brand/10 border border-brand/20 text-brand overflow-hidden"}>
                        {badge}
                        <Button
                            type={"button"}
                            onClick={(e) => handleRemoveBadge(e, badge)}
                            variant={"ghost"}
                            className={"px-0.5 hover:bg-0"}
                        >
                            <X size={12}/>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export {BadgeInput}
