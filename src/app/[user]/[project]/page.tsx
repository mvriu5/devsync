"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/Avatar"
import {CommitCard} from "@/components/CommitCard"
import {ProgressBar} from "@/components/ui/Progressbar"
import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/Dialog"
import {Input} from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import {verify} from "@/lib/hash"
import {useMutation} from "@tanstack/react-query"

interface ProjectPageProps {
    params: {
        user: string
        project: string
    }
}

export default function ProjectPage({params}: ProjectPageProps) {
    const [authenticated, setAuthenticated] = useState(false)
    const [passwordInput, setPasswordInput] = useState("")
    const [authError, setAuthError] = useState<string | null>("")

    const { mutate: authenticate, isPending } = useMutation({
        mutationFn: async (plainPassword: string) => {
            setAuthError(null)

            const user = await getUserByUsername(params.user)

            const projects = await getProjectsByUserId(user.id)

            const project = projects.find(p => p.slug === params.project)
            if (!project) throw new Error("Project not found")

            const ok = await verify(project.password, plainPassword)
            if (!ok) throw new Error("Wrong password.")

            return { user, project }
        },
        onSuccess: () => {
            setAuthenticated(true)
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : "Authentication failed."
            setAuthError(message)
        }
    })

    if (!authenticated) {
        return (
            <Dialog open={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{"Authenticate"}</DialogTitle>
                    </DialogHeader>
                    <div className={"flex flex-col gap-2"}>
                        <p className={"font-mono text-sm text-tertiary"}>Authenticate with the given password to view the progress page of the project.</p>
                        <Input
                            type={"password"}
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder={"Password"}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isPending) authenticate(passwordInput)
                            }}
                        />
                    </div>
                    <div className={"flex items-center gap-2 justify-end"}>
                        <Button
                            variant={"ghost"}
                        >
                            Go back
                        </Button>
                        <Button
                            variant={"brand"}
                            onClick={() => authenticate(passwordInput)}
                            disabled={!passwordInput || isPending}
                        >
                            {isPending ? "Authenticating..." : "Authenticate"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

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