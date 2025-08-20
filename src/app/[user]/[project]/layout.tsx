import {ReactNode} from "react"

export default function ProjectLayout({ children }: { children: ReactNode }) {
    return (
        <div className={"bg-background w-screen min-h-screen flex flex-col items-center justify-center"}>
            {children}
        </div>
    )
}