import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "../ui/Dialog"
import {Button} from "@/components/ui/Button"
import { Form, FormField, FormInput, FormItem, FormLabel, FormMessage } from "../ui/Form"
import { useToast } from "../ui/ToastProvider"
import z from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Spinner} from "@/components/ui/Spinner"
import {useProjectStore} from "@/store/projectStore"
import {useGitHubRepos} from "@/hooks/useGithub"
import {authClient} from "@/lib/auth-client"
import {useQuery} from "@tanstack/react-query"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/Select"
import {FolderGit2, PackagePlus} from "lucide-react"

interface ProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const ProjectDialog = ({open, onOpenChange}: ProjectDialogProps) => {
    const {addToast} = useToast()
    const {data: session, isPending: sessionLoading, error: sessionError} = authClient.useSession()
    const {data: accessData, isLoading: tokenLoading, error: tokenError} = useQuery({
        queryKey: ["github-access-token"],
        queryFn: () => authClient.getAccessToken({ providerId: "github" }),
        enabled: !!session,
        staleTime: 1000 * 60 * 5,
    })
    const {data: repos, isLoading: reposLoading, isError: reposError} = useGitHubRepos(accessData?.data?.accessToken ?? "")
    const {projects, addProject} = useProjectStore()

    const formSchema = z.object({
        name: z.string()
            .min(3, {message: "Please enter more than 3 characters."})
            .max(12, {message: "Please enter less than 12 characters."})
            .refine((name) => !projects?.some(p => p.name === name), { message: "A project with this name already exists." }),
        description: z.string().optional(),
        repository: z.url()
            .startsWith("https://github.com/")
            .refine((url) => !projects?.some(p => p.repoUrl = url), { message: "A project of this repository already exists." }),
        todos: z.array(z.string()).optional(),
        status: z.enum(["in-progress", "completed", "paused", "to-do", "backlog"])
            .default("to-do")
            .optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            repository: "",
            todos: [],
            status: "to-do"
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!session) return

        await addProject({
            userId: session.user.id,
            name: values.name,
            description: values.description ?? "",
            repoUrl: values.repository,
            todos: values.todos,
            status: values.status ?? "to-do",
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now())
        })

        addToast({
            title: "Successfully created a new dashboard!",
            icon: <PackagePlus size={24} className={"text-brand"}/>
        })

        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"primary"}>
                    New
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between gap-4 h-full">
                        <div className="flex flex-col justify-center gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormInput placeholder="Name" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormInput placeholder="Description" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="repository"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repository</FormLabel>
                                        <Select
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={reposLoading || !repos?.length}
                                        >
                                            <SelectTrigger className={"data-[state=open]:bg-secondary data-[state=open]:text-primary"}>
                                                <FolderGit2 size={16} className={"text-tertiary"}/>
                                                <SelectValue placeholder="Repository"/>
                                            </SelectTrigger>
                                            <SelectContent align={"end"}>
                                                {repos?.map(repo => (
                                                    <SelectItem key={repo.html_url} value={repo.html_url}>
                                                        {repo.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className={"w-full flex gap-2 justify-end"}>
                            <Button
                                variant={"primary"}
                                className={"w-max"}
                                type={"reset"}
                                onClick={() => {
                                    onOpenChange(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={"brand"}
                                className={"w-max"}
                                type={"submit"}
                                disabled={form.formState.isSubmitting}
                            >
                                {(form.formState.isSubmitting) && <Spinner/>}
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export { ProjectDialog }