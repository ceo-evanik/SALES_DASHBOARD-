"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { useUser } from "@/context/UserProvider"

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false)
    const { user } = useUser()

    return (
        <div className="flex h-screen bg-white dark:bg-slate-900">
            {/* Sidebar */}
            <Sidebar
                isSideBarOpen={isSideBarOpen}
                setIsSideBarOpen={setIsSideBarOpen}
                role={user?.userType}
            />

            {/* Main content */}
            <div className="flex flex-1 flex-col lg:pl-64 overflow-hidden">
                {/* Topbar */}
                <Topbar
                    isSideBarOpen={isSideBarOpen}
                    setIsSideBarOpen={setIsSideBarOpen}
                />

                {/* Inner Scrollbar (only children) */}
                <main className="flex-1 overflow-y-auto text-black dark:text-white">
                    {children}
                </main>
            </div>
        </div>
    )
}
