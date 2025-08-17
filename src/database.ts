import {drizzle} from 'drizzle-orm/node-postgres'
import {eq} from "drizzle-orm"
import {project} from "@/db/schema"

export const db = drizzle(process.env.DATABASE_URI!)

export type Project = {
    id: string
    userId: string
    name: string
    description: string
    password: string
    repoUrl: string
    link: string
    todos: Record<string, never>
    status: string
    createdAt: Date
    updatedAt: Date
}

export type ProjectInsert = typeof project.$inferInsert
type ProjectSelect = typeof project.$inferSelect

export const createProject = async (data: ProjectInsert) => {
    return db
        .insert(project)
        .values(data)
        .returning()
}

export const updateProject = async (id: string, data: Partial<ProjectInsert>) => {
    const now = new Date()
    return db
        .update(project)
        .set({...data, updatedAt: now,})
        .where(eq(project.id, id))
        .returning()
}

export const deleteProject = async (id: string) => {
    return db
        .delete(project)
        .where(eq(project.id, id))
        .returning()
}

export const getProjectsFromUser = async (userId: string): Promise<ProjectSelect[]> => {
    return db
        .select()
        .from(project)
        .where(eq(project.userId, userId))

}