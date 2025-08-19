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
import {useGitHubRepos} from "@/hooks/useGithub"
import {authClient} from "@/lib/auth-client"
import {useGitHubCommits} from "@/hooks/useGithubCommits"

interface ProjectPageProps {
    params: Promise<{
        user: string
        project: string
    }>
}

export default function ProjectPage({params}: ProjectPageProps) {
    const [authenticated, setAuthenticated] = useState(false)
    const [passwordInput, setPasswordInput] = useState("")
    const [authError, setAuthError] = useState<string | null>("")

    const [userObject, setUserObject] = useState<User | null>(null)
    const [projectObject, setProjectObject] = useState<Project | null>(null)

    const { user, project } = use(params)

    //Github commits
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

    console.log(projectObject)

    return (
        <div className={"flex flex-col w-full min-h-screen p-8 gap-8 items-center justify-center bg-background"}>
            <div className={"flex flex-col xl:w-1/2 justify-center gap-2"}>
                <div className={"flex item-center gap-2"}>
                    <Avatar className={"size-6"}>
                        <AvatarImage src={userObject?.image ?? ""}/>
                        <AvatarFallback/>
                    </Avatar>
                    <p>{userObject?.name}</p>
                </div>
                <div className={"flex items-center justify-between gap-2"}>
                    <p className={"text-xl font-semibold text-primary"}>{projectObject?.name}</p>
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
                {commits?.map((commit) => (
                    <CommitCard
                        key={commit.commit.url}
                        title={commit.commit.message}
                        commitType={"Commit"}
                        date={new Date(commit.commit.author?.date ?? new Date()) ?? new Date()}
                        linesAdded={commit.stats?.additions ?? 0}
                        linesRemoved={commit.stats?.deletions ?? 0}/>
                ))}
                <div className={"bg-primary/40 px-4 py-2 gap-4 flex w-full border border-main/40 shadow-md items-center justify-center"}>
                    <p className={"text-tertiary"}>See all...</p>
                </div>
            </div>


        </div>
    )
}