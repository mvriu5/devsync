import {useState} from "react"
import {Input} from "@/components/ui/Input"
import { cn } from "@/lib/utils"

interface BadgeInputProps {
    inputValue: string
    onInputValueChange: (value: string) => void
    values: string[]
    onValueChange: (value: string) => void
    placeholder: string
    className?: string
}

function BadgeInput({ inputValue, onInputValueChange, values, onValueChange, placeholder, className }: BadgeInputProps) {
    const [badges, setBadges] = useState<string[]>(values ?? [])

    const handleAddBadge = () => {
        setBadges([...badges, inputValue])
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Input
                value={inputValue}
                onChange={(e) => onInputValueChange(e.target.value)}
                placeholder={placeholder}
                onKeyDown={(e) => e.key == "Enter" && handleAddBadge()}
            />

            <div className={"w-full flex- items-center gap-2"}>
                {badges.map((badge, i) => (
                    <div className={"px-2 rounded-xs bg-secondary text-tertiary"}>{badge}</div>
                ))}
            </div>
        </div>
    )
}

export {BadgeInput}
