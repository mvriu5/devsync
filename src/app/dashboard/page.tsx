"use client"

import {Boxes, LogOut, Settings, User} from "lucide-react"
import {ProjectDialog} from "@/components/dialogs/ProjectDialog"
import {useEffect, useState} from "react"
import {useProjectStore} from "@/store/projectStore"
import {authClient} from "@/lib/auth-client"
import { ProjectCard } from "@/components/ProjectCard"
import { EmptySvg } from "@/components/EmptySvg"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/Avatar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/Popover"
import {Spinner} from "@/components/ui/Spinner"
import {useRouter} from "next/navigation"

export default function Dashboard() {
    const router = useRouter()
    const {data: session, isPending: sessionLoading, error: sessionError} = authClient.useSession()
    const {projects, getAllProjects} = useProjectStore()

    const [open, setOpen] = useState(false)
    const [signoutLoading, setSignoutLoading] = useState(false)

    useEffect(() => {
        if(!session) return
        getAllProjects(session.user.id)
    }, [session])

    const handleSignout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                }
            }
        })
    }

    return (
        <div className="relative h-screen w-full flex flex-col p-8 gap-8 items-center justify-center bg-background">
            <div className={"w-1/2 flex flex-col"}>
                <div className="flex items-center justify-between border border-main p-2 bg-primary rounded-xs rounded-b-none">
                    <div className={"flex items-center gap-2 text-primary font-semibold text-lg"}>
                        <Boxes size={24}/>
                        Projects
                    </div>
                    <div className={"flex items-center gap-2"}>
                        <ProjectDialog open={open} onOpenChange={setOpen} />
                    </div>

                </div>
                {projects?.map((project) => (
                    <ProjectCard key={project.id} project={project}/>
                ))}
                {!projects || projects.length === 0 && (
                    <div className={"flex flex-col mt-8 gap-2 justify-center items-center"}>
                        <EmptySvg/>
                        <p className={"text-tertiary"}>No projects yet.</p>
                    </div>
                )}
            </div>
            <div className={"absolute top-4 right-4"}>
            <Popover>
                <PopoverTrigger>
                    <div className={"flex items-center gap-2 bg-primary rounded-xs border border-main px-2 py-1"}>
                        <Avatar className={"size-5"}>
                            <AvatarImage src={""}/>
                            <AvatarFallback/>
                        </Avatar>
                        <p>mvriu5</p>
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className={"bg-background p-1 w-max md:w-36 gap-1"}
                    align={"end"}
                >
                    <button
                        type={"button"}
                        className={"w-full flex gap-2 px-2 py-1 items-center rounded-xs hover:bg-secondary hover:text-primary ring-0 outline-0"}
                    >
                        <User size={16} className={"text-tertiary"}/>
                        <p>Profile</p>
                    </button>
                    <button
                        type={"button"}
                        className={"w-full flex gap-2 px-2 py-1 items-center rounded-xs hover:bg-secondary hover:text-primary ring-0 outline-0"}
                    >
                        <Settings size={16} className={"text-tertiary"}/>
                        <p>Settings</p>
                    </button>
                    <button
                        type={"button"}
                        className={"w-full flex gap-2 px-2 py-1 items-center rounded-xs hover:bg-error/10 text-error ring-0 outline-0"}
                        onClick={handleSignout}
                    >
                        {signoutLoading ? <Spinner className={"text-error"}/> : <LogOut size={16} className={"text-error/70"}/>}
                        <p>Logout</p>
                    </button>
                </PopoverContent>
            </Popover>
            </div>
        </div>
    )
}