import {NextResponse} from "next/server"
import {
    createProject,
    deleteProject,
    getProjectsFromUser,
    updateProject
} from "@/database"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, name, description, repoUrl, todos, status, password, link } = body

        if (!userId || !name || !repoUrl || !status || !password || !link) {
            return NextResponse.json(
                { error: "userId, name, repoUrl, status, password and link are required" },
                { status: 400 })
        }

        const newProject = await createProject({
            userId,
            name,
            description,
            repoUrl,
            password,
            link,
            todos,
            status,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return NextResponse.json(newProject, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')

        if (!userId ) {
            return NextResponse.json(
                { error: "userId is required as a query parameter" },
                { status: 400 })
        }

        if (userId) {
            const projects = await getProjectsFromUser(userId)
            return NextResponse.json(projects, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, name, description, repoUrl, todos, status, password, link } = body

        if (!id) {
            return NextResponse.json(
                { error: "Project id is required" },
                { status: 400 })
        }

        const updatedProject = await updateProject(id, { name, description, repoUrl, todos, status, password, link })

        if (!updatedProject) {
            return NextResponse.json(
                { error: "Project not found or could not be updated" },
                { status: 404 })
        }

        return NextResponse.json(updatedProject, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: "Project id is required" },
                { status: 400 })
        }

        const deletedProject = await deleteProject(id)

        if (!deletedProject) {
            return NextResponse.json(
                { error: "Project not found or could not be deleted" },
                { status: 404 })
        }

        return NextResponse.json(deletedProject, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 })
    }
}