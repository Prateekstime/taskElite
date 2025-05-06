"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getUser } from "@/lib/auth"

export default function DashboardPage({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const user = getUser()
        if (!user) {
            router.push("/login")
        } else {
            setIsLoading(false)
        }
    }, [router])

    if (isLoading) return null // or show a loader

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    )
}
