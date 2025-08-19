import { User } from "better-auth"
import {Project} from "@/database"

export async function getUserByUsername(username: string): Promise<User> {
    const res = await fetch(`/api/users?name=${encodeURIComponent(username)}`, { method: "GET" })
    if (!res.ok) throw new Error("User could not be found.")
    return res.json()
}

export async function getProjectsByUserId(userId: string): Promise<Project[]> {
    const res = await fetch(`/api/projects?userId=${encodeURIComponent(userId)}`, { method: "GET" })
    if (!res.ok) throw new Error("Projects could not be found.")
    return res.json()
}
