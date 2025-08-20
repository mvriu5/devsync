import {GitCommitVertical, GitMerge} from "lucide-react"
import {format} from "date-fns"
import {cn} from "@/lib/utils"

type CommitType = "Commit" | "Merge"

interface CommitCardProps {
    title: string
    commitType: CommitType
    date: Date
    linesAdded: number
    linesRemoved: number

}
function CommitCard({title, commitType, date, linesAdded, linesRemoved}: CommitCardProps) {
    return (
        <div className={"w-full bg-primary px-4 py-2 gap-4 flex flex-nowrap border border-main shadow-md items-center rounded-xs"}>
            <div className={"bg-white/5 p-2 rounded-xs shrink-0"}>
                {commitType === "Commit" ? <GitCommitVertical className={"text-brand"} size={24}/> : <GitMerge size={24} className={"text-brand"}/>}
            </div>
            <div className="flex flex-col w-full justify-center">
                <div className={"w-full flex flex-nowrap items-center justify-between gap-2"}>
                    <p className="text-lg text-primary font-medium truncate">{title}</p>
                    <div className={"flex items-center gap-2"}>
                        <div className={"rounded-full flex px-2 bg-success/10 text-sm text-success border border-success/20 shrink-0 whitespace-nowrap"}>
                            {`+${linesAdded}`}
                        </div>
                        <div className={"rounded-full flex px-2 bg-error/10 text-sm text-error border border-error/20 shrink-0 whitespace-nowrap"}>
                            {`-${linesRemoved}`}
                        </div>
                    </div>
                </div>
                <p className={"text-sm text-tertiary"}>{format(date, "yyyy-MM-dd HH:mm")}</p>
            </div>
        </div>
    )
}

export { CommitCard }