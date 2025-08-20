import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import {ReactNode} from "react"
import {Providers} from "@/components/Providers"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "DevSync",
    description: "Sync your work with your customers"
}

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background w-screen flex flex-col items-center justify-center`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
