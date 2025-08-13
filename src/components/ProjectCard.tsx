import {Project} from "@/database"
import {CircleDashed, Ellipsis, ExternalLink, Link2, Pencil, Trash} from "lucide-react"
import {Button} from "@/components/ui/Button"
import {StatusIcon} from "@/components/Status"
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/DropdownMenu"
import {useProjectStore} from "@/store/projectStore"

interface ProjectCardProps {
    project: Project
}
function ProjectCard({project}: ProjectCardProps) {
    const { removeProject, refreshProject } = useProjectStore()

    const handleEdit = () => {
        //edit dialog
    }

    const handleDelete = async () => {
        await removeProject(project.id)
        //dialog zur sicherheit
        //toast
    }

    const handleOpen = () => {
        //navigate zur view page
    }

    const handleChangeStatus = () => {
        //
    }

    return (
        <div className={"w-full flex flex-col gap-2 p-2 border border-t-0 border-main rounded-xs rounded-t-none"}>
            <div className={"flex items-center justify-between gap-1"}>
                <div className={"flex items-center gap-2"}>
                    <StatusIcon statusId={project.status}/>
                    <p>{project.name}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost_icon"} className={"data-[state=open]:bg-secondary data-[state=open]:text-primary"}>
                            <Ellipsis size={16}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel>Project settings</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleOpen}>
                                <ExternalLink size={14} className={"hover:text-secondary"}/>
                                Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEdit}>
                                <Pencil size={16} className={"hover:text-secondary"}/>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleChangeStatus}>
                                <CircleDashed size={16} className={"hover:text-secondary"}/>
                                Change Status
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className={"text-error focus:text-error focus:bg-error/10"} onClick={handleDelete}>
                                <Trash size={14} className={"text-error"}/>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className={"flex items-center justify-between gap-1"}>
                <div className={"w-max bg-secondary/30 rounded-xs px-2 py-1 flex items-center gap-1 text-tertiary text-xs"}>
                    <Link2 size={16} />
                    <p className={"font-mono"}>Repository:</p>
                    <p className={"text-secondary"}>{project.repoUrl}</p>
                </div>
                <p className={"text-tertiary font-mono text-xs"}>{"2025-12-3"}</p>
            </div>
        </div>
    )
}

export { ProjectCard }