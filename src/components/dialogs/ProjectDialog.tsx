"use client"

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
import {FolderGit2, Info, PackagePlus} from "lucide-react"
import {hash} from "@/lib/hash"
import {LinkInput} from "@/components/ui/LinkInput"

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
            .refine((name) => !projects?.some(p => p.name == name), { message: "A project with this name already exists." }),
        description: z.string().optional(),
        password: z.string().min(6),
        repository: z.url()
            .startsWith("https://github.com/")
            .refine((url) => !projects?.some(p => p.repoUrl == url), { message: "A project of this repository already exists." }),
        link: z.string()
            .refine((link) => !projects?.some(p => p.link == link), {message: "A project with this link already exists."}),
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
            password: "",
            repository: "",
            link: "",
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
            password: await hash(values.password),
            repoUrl: values.repository,
            link: values.link,
            todos: values.todos,
            status: values.status ?? "to-do",
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now())
        })

        addToast({
            title: "Successfully created a new project!",
            icon: <PackagePlus size={24} className={"text-brand"}/>
        })

        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                onOpenChange(value)
                if (!open) form.reset()
            }}
        >
            <DialogTrigger asChild>
                <Button variant={"primary"}>
                    New
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New project</DialogTitle>
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormInput placeholder="Password" type={"password"} {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className={"flex items-center gap-1 -mt-2 text-tertiary"}>
                                <Info size={12}/>
                                <p className={"text-xs"}>This is the required password for your customers to access the progress page.</p>
                            </div>

                            <FormField
                                control={form.control}
                                name="repository"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repository</FormLabel>
                                        <Select
                                            {...field}
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                const repoName = repos?.find(r => r.html_url === value)?.name
                                                if (repoName) form.setValue("link", repoName.toLowerCase())
                                            }}
                                            disabled={reposLoading || !repos?.length}
                                        >
                                            <SelectTrigger className={"data-[state=open]:bg-secondary data-[state=open]:text-primary data-[placeholder]:text-placeholder"}>
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

                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link</FormLabel>
                                        <LinkInput
                                            {...field}
                                            domain={`devsync.com/${session?.user.name.toLowerCase().replace(/ /g, "")}`}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className={"flex items-center gap-1 -mt-2 text-tertiary"}>
                                <Info size={12}/>
                                <p className={"text-xs"}>This is the link to the progress page of the project.</p>
                            </div>

                        </div>
                        <div className={"w-full flex gap-2 justify-end"}>
                            <Button
                                variant={"ghost"}
                                className={"w-max"}
                                type={"reset"}
                                onClick={() => {
                                    onOpenChange(false)
                                    form.reset()
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