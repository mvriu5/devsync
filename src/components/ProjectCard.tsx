import {Project} from "@/database"
import {CircleDashed, Ellipsis, ExternalLink, Link2, PackageMinus, Pencil, Trash} from "lucide-react"
import {Button} from "@/components/ui/Button"
import {status, StatusIcon} from "@/components/Status"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "./ui/DropdownMenu"
import {useProjectStore} from "@/store/projectStore"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/Dialog"
import {useToast} from "@/components/ui/ToastProvider"
import {useState} from "react"

interface ProjectCardProps {
    project: Project
}
function ProjectCard({project}: ProjectCardProps) {
    const { removeProject, refreshProject } = useProjectStore()
    const {addToast} = useToast()

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [projectStatus, setProjectStatus] = useState<string>(project.status ?? "to-do")

    const handleEdit = () => {
        //edit dialog
    }

    const handleDelete = async () => {
        await removeProject(project.id)

        addToast({
            title: `Removed the project: ${project.name}`,
            icon: <PackageMinus size={24} className={"text-brand"}/>
        })

        setDeleteDialogOpen(false)
    }

    const handleOpen = () => {
        //navigate zur view page
    }

    const handleChangeStatus = async (statusId: string) => {
        setProjectStatus(statusId)
        const newProject = {...project, status: statusId}
        await refreshProject(newProject)
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
                        <Button variant={"ghost_icon"} className={"data-[state=open]:bg-secondary data-[state=open]:text-primary transition-all"}>
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
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <DropdownMenuItem>
                                        <CircleDashed size={16} className={"hover:text-secondary"}/>
                                        Change Status
                                    </DropdownMenuItem>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent sideOffset={8}>
                                    <DropdownMenuRadioGroup value={projectStatus} onValueChange={handleChangeStatus}>
                                    {status.map((s) => (
                                        <DropdownMenuRadioItem key={s.id} value={s.id}>
                                            <StatusIcon statusId={s.id}/>
                                            {s.name}
                                        </DropdownMenuRadioItem>
                                    ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem className={"text-error focus:text-error focus:bg-error/10"} onSelect={(e) => e.preventDefault()}>
                                        <Trash size={14} className={"text-error"}/>
                                        Delete
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className={"p-4"}>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
                                    </DialogHeader>
                                    <div className={"flex justify-end items-center gap-2"}>
                                        <Button variant={"primary"} onClick={() => setDeleteDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant={"error"} onClick={handleDelete}>
                                            Delete
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
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