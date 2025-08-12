import {Project} from "@/database"
import {CircleDashed, Ellipsis, ExternalLink, Link2, Pencil, Trash} from "lucide-react"
import {Button} from "@/components/ui/Button"
import {StatusIcon} from "@/components/Status"
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/DropdownMenu"

interface ProjectCardProps {
    project: Project
}
function ProjectCard({project}: ProjectCardProps) {
    return (
        <div className={"w-full flex items-center justify-between gap-2 p-2 border border-t-0 border-main rounded-xs rounded-t-none"}>
            <div className={"flex items-center gap-2"}>
                <StatusIcon statusId={project.status}/>
                <p>{project.name}</p>
                <div className={"bg-secondary/30 rounded-xs px-2 py-1 flex items-center gap-1 text-tertiary text-xs"}>
                    <Link2 size={16} />
                    <p className={"font-mono"}>Repository:</p>
                    <p className={"text-secondary"}>{project.repoUrl}</p>
                </div>
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
                        <DropdownMenuItem>
                            <ExternalLink size={14} className={"hover:text-secondary"}/>
                            Open
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Pencil size={16} className={"hover:text-secondary"}/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CircleDashed size={16} className={"hover:text-secondary"}/>
                            Change Status
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className={"text-error focus:text-error focus:bg-error/10"}>
                            <Trash size={14} className={"text-error"}/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export { ProjectCard }