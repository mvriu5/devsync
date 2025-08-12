"use client"

import { create } from "zustand/react"
import {Project, ProjectInsert} from "@/database"

interface ProjectStore {
    projects: Project[] | null
    currentProject: Project | null
    addProject: (project: ProjectInsert) => Promise<Project>
    refreshProject: (project: Project) => Promise<void>
    removeProject: (project: Project) => Promise<void>
    getAllProjects: (userId: string) => Promise<void>
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: null,
    currentProject: null,

    addProject: async (project: ProjectInsert) => {
        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project)
            })
            const newProject = await response.json()
            set({
                projects: [...(get().projects || []), newProject[0]],
                currentProject: newProject[0]
            })
            return newProject
        } catch (error) {
            set({ projects: get().projects })
            throw error
        }
    },

    refreshProject: async (project: Project) => {
        try {
            const response = await fetch(`/api/projects?id=${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project)
            })
            const updatedProject = await response.json()
            set({
                projects: get().projects!.map((p) => p.id === updatedProject[0].id ? updatedProject[0] : p),
                currentProject: get().currentProject?.id === project.id
                    ? updatedProject[0]
                    : get().currentProject
            })
        } catch (error) {
            set({ projects: get().projects })
            throw error
        }
    },

    removeProject: async (project: Project) => {
        try {
            await fetch(`/api/projects?id=${project.id}`, { method: "DELETE" })
            const updatedList = get().projects?.filter(p => p.id !== project.id) || null
            set({
                projects: updatedList,
                currentProject: updatedList && get().currentProject?.id === project.id
                    ? updatedList[0]
                    : get().currentProject,
            })
        } catch (error) {
            set({ projects: get().projects })
            throw error
        }
    },

    getAllProjects: async (userId: string) => {
        try {
            const projectsRes = await fetch(`/api/projects?userId=${userId}`)
            const projects = await projectsRes.json()
            set({ projects })
        } catch (error) {
            set({ projects: get().projects })
            throw error
        }
    }
}))
