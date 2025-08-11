"use client"

import {ToastProvider, useToast} from "@/components/ui/ToastProvider"
import {authClient} from "@/lib/auth-client"
import {CircleX, Github} from "lucide-react"
import {Button} from "@/components/ui/Button"

export default function SignIn() {
    const { addToast } = useToast()

    const onGithubSignin = async () => {
        await authClient.signIn.social({provider: "github", callbackURL: "/dashboard"}, {
            onRequest: (ctx) => {
            },
            onSuccess: (ctx) => {
            },
            onError: (ctx) => {
                addToast({
                    title: "An error occurred",
                    subtitle: ctx.error.message,
                    icon: <CircleX size={24}/>
                })
            }
        })
    }

    return (
        <ToastProvider>
            <div className={"h-screen w-full flex items-center justify-center"}>

                <Button
                    type={"button"}
                    className={"w-full"}
                    variant={"brand"}
                    onClick={onGithubSignin}
                >
                    <Github size={18}/>
                </Button>

            </div>
        </ToastProvider>
    )
}