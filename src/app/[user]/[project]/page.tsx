"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/Avatar"
import {CommitCard} from "@/components/CommitCard"
import {ProgressBar} from "@/components/ui/Progressbar"
import {use, useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/Dialog"
import {Input} from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import {verify} from "@/lib/hash"
import {useMutation, useQuery} from "@tanstack/react-query"
import {getProjectsByUserId, getUserByUsername} from "@/actions/user"
import {User} from "better-auth"
import {Project} from "@/database"
import {Github} from "lucide-react"
import Link from "next/link"
import {status} from "@/components/Status"
import {authClient} from "@/lib/auth-client"
import {useGitHubCommits} from "@/hooks/useGithubCommits"
import {ScrollArea} from "@/components/ui/ScrollArea"
import {useRouter} from "next/navigation"
import {StatusIcon} from "@/components/Status"

interface ProjectPageProps {
    params: Promise<{
        user: string
        project: string
    }>
}

export default function ProjectPage({params}: ProjectPageProps) {
    const router = useRouter()

    const [authenticated, setAuthenticated] = useState(false)
    const [passwordInput, setPasswordInput] = useState("")
    const [authError, setAuthError] = useState<string | null>("")

    const [userObject, setUserObject] = useState<User | null>(null)
    const [projectObject, setProjectObject] = useState<Project | null>(null)

    const { user, project } = use(params)

    const {data: session, isPending: sessionLoading, error: sessionError} = authClient.useSession()
    const {data: accessData, isLoading: tokenLoading, error: tokenError} = useQuery({
        queryKey: ["github-access-token"],
        queryFn: () => authClient.getAccessToken({ providerId: "github" }),
        enabled: !!session,
        staleTime: 1000 * 60 * 5,
    })
    const {data: commits, isLoading: commitsLoading, isError: commitsError} = useGitHubCommits(
        accessData?.data?.accessToken ?? "",
        userObject?.name ?? "",
        projectObject?.link ?? ""
    )

    const { mutate: authenticate, isPending } = useMutation({
        mutationFn: async (plainPassword: string) => {
            setAuthError(null)

            const foundUser = await getUserByUsername(user)
            setUserObject(foundUser)

            const projectList = await getProjectsByUserId(foundUser.id)

            const proj = projectList.find(p => p.link === project)
            if (!proj) throw new Error("Project not found")
            setProjectObject(proj)

            const ok = await verify(proj.password, plainPassword)
            if (!ok) setAuthError("Wrong password!")

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
                        <p className={"text-error text-sm"}>{authError}</p>
                    </div>
                    <div className={"flex items-center gap-2 justify-end"}>
                        <Button
                            variant={"ghost"}
                            onClick={() => router.push("/")}
                        >
                            Go back
                        </Button>
                        <Button
                            variant={"brand"}
                            onClick={() => authenticate(passwordInput)}
                            disabled={!passwordInput || isPending}
                            loading={isPending}
                        >
                            Authenticate
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className={"w-2/3 flex flex-col p-8 gap-8 items-center justify-center"}>
            <div className={"w-full flex flex-col justify-center gap-2"}>
                <div className={"flex item-center gap-2"}>
                    <Avatar className={"size-6"}>
                        <AvatarImage src={userObject?.image ?? ""}/>
                        <AvatarFallback/>
                    </Avatar>
                    <p>{userObject?.name}</p>
                </div>
                <div className={"flex items-center justify-between gap-2"}>
                    <div className={"flex items-center gap-2"}>
                        <p className={"text-xl font-semibold text-primary"}>{projectObject?.name}</p>
                        <div className={"h-6 flex items-center gap-1 px-2 bg-secondary rounded-xs shadow-sm"}>
                            <StatusIcon statusId={projectObject?.status ?? "to-do"}/>
                            <p className={"text-sm font-mono"}>{status.find((s) => s.id == projectObject?.status)?.name ?? "Todo"}</p>
                        </div>

                    </div>
                    <Link href={projectObject?.repoUrl ?? ""}>
                        <Button
                            className={"flex items-center gap-1 text-sm bg-primary hover:bg-secondary rounded-xs shadow-md px-2 py-0.5 font-normal"}
                        >
                            <Github size={16}/>
                            {projectObject?.link}
                        </Button>
                    </Link>
                </div>
                <p>{projectObject?.description ?? ""}</p>
            </div>

            <div className={"w-full flex flex-col justify-center gap-2"}>
                <div className={"flex item-center gap-2"}>
                    <p className={"text-sm text-tertiary text-nowrap"}>Progress</p>
                    <div className={"w-full h-px bg-secondary/50 mt-2.5"}/>
                </div>
                <div>Current State: In Progress</div>
                <ProgressBar value={60} className={"h-2"}/>
                <p>{"60% are already done!"}</p>
            </div>

            <div className={"w-full flex flex-col justify-center gap-2"}>
                <div className={"flex item-center gap-2"}>
                    <p className={"text-sm text-tertiary text-nowrap"}>Todos</p>
                    <div className={"w-full h-px bg-secondary/50 mt-2.5"}/>
                </div>
                {projectObject?.todos.map((value) => (
                    <div key={value}>
                        {value}
                    </div>
                ))}
            </div>

            <div className={"w-full flex flex-col justify-center gap-4"}>
                <div className={"flex item-center gap-2"}>
                    <p className={"text-sm text-tertiary text-nowrap"}>Latest Commits </p>
                    <div className={"w-full h-px bg-secondary/50 mt-2.5"}/>
                </div>
                <ScrollArea className={"h-80"}>
                    <div className={"flex flex-col gap-2 w-full"}>
                        {commits?.map((commit) => (
                            <CommitCard
                                key={commit.commit.url}
                                title={commit.commit.message}
                                commitType={"Commit"}
                                date={new Date(commit.commit.author?.date ?? new Date()) ?? new Date()}
                                linesAdded={commit.stats?.additions ?? 0}
                                linesRemoved={commit.stats?.deletions ?? 0}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}