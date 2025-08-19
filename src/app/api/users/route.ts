import {NextResponse} from "next/server"
import {getUserByName} from "@/database"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const name = searchParams.get('name')

        if (!name) {
            return NextResponse.json(
                { error: "name is required as a query parameter" },
                { status: 400 }
            )
        }

        const users = await getUserByName(name)
        return NextResponse.json(users[0], { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}