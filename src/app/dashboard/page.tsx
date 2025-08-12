"use client"

import {Boxes, Ellipsis} from "lucide-react"
import {Button} from "@/components/ui/Button"
import {ProjectDialog} from "@/components/dialogs/ProjectDialog"
import {useEffect, useState} from "react"
import {useProjectStore} from "@/store/projectStore"
import {authClient} from "@/lib/auth-client"

export default function Dashboard() {
    const {data: session, isPending: sessionLoading, error: sessionError} = authClient.useSession()
    const {projects, getAllProjects} = useProjectStore()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if(!session) return
        getAllProjects(session.user.id)
    }, [session])

    return (
        <div className="h-screen w-full flex flex-col p-8 gap-8 items-center justify-center bg-background">
            <div className="flex items-center justify-between xl:w-1/2 border border-main p-2 bg-primary rounded-xs">
                <div className={"flex items-center gap-2 text-primary font-semibold text-lg"}>
                    <Boxes size={24}/>
                    Projects
                </div>
                <div className={"flex items-center gap-2"}>
                    <ProjectDialog open={open} onOpenChange={setOpen} />
                    <Button variant={"ghost_icon"}>
                        <Ellipsis size={16}/>
                    </Button>
                </div>

            </div>

            <div className={"flex flex-col gap-2"}>
                {projects?.map((project) => (
                    <p key={project.id}>{project.name}</p>
                ))}
            </div>
        </div>
    )
}