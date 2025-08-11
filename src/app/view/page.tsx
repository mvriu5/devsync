import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/Avatar"
import {CommitCard} from "@/components/CommitCard"
import {ProgressBar} from "@/components/ui/Progressbar"

export default function Page() {
    return (
        <div className={"flex flex-col w-full h-screen p-8 gap-8 items-center justify-center bg-background"}>

            <div className={"flex flex-col xl:w-1/2 justify-center gap-2"}>
                <div className={"flex item-center gap-2"}>
                    <Avatar className={"size-6"}>
                        <AvatarImage src={""}/>
                        <AvatarFallback/>
                    </Avatar>
                    <p>{"Marius Ahsmus"}</p>
                </div>
                <p className={"text-primary font-semibold text-2xl"}>Sample project</p>
                <p>
                    Lorem ipsum this is a description for a sample project. You can now check the things under this.
                </p>
            </div>

            <div className={"flex flex-col xl:w-1/2 justify-center gap-2"}>
                <div className={"flex item-center gap-2"}>
                    <p className={"text-sm text-tertiary text-nowrap"}>Progress</p>
                    <div className={"w-full h-px bg-secondary/50 mt-2.5"}/>
                </div>
                <div>Current State: In Progress</div>
                <ProgressBar value={60} className={"h-2"}/>
                <p>{"60% are already done!"}</p>
            </div>

            <div className={"flex flex-col xl:w-1/2 justify-center gap-4"}>
                <div className={"flex item-center gap-2"}>
                    <p className={"text-sm text-tertiary text-nowrap"}>Latest Commits </p>
                    <div className={"w-full h-px bg-secondary/50 mt-2.5"}/>
                </div>
                <CommitCard title={"feat: initial commit"} commitType={"Commit"} date={new Date()} linesAdded={153} linesRemoved={230}/>
                <CommitCard title={"feat: added authentication"} commitType={"Commit"} date={new Date()} linesAdded={153} linesRemoved={230}/>
                <CommitCard title={"fix: google integration bug"} commitType={"Commit"} date={new Date()} linesAdded={153} linesRemoved={230}/>
                <CommitCard title={"Merged feat/github implementation"} commitType={"Merge"} date={new Date()} linesAdded={153} linesRemoved={230}/>
                <CommitCard title={"fix: github oauth link"} commitType={"Commit"} date={new Date()} linesAdded={153} linesRemoved={230}/>
                <div className={"bg-primary/40 px-4 py-2 gap-4 flex w-full border border-main/40 shadow-md items-center justify-center"}>
                    <p className={"text-tertiary"}>See all...</p>
                </div>
            </div>


        </div>
    )
}