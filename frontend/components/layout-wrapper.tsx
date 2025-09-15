"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false)
    return (
        <div className="flex h-screen bg-white dark:bg-slate-900">
            {/* Sidebar */}
            <Sidebar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} role="admin" />

            {/* Main content */}
            <div className="flex flex-1 flex-col lg:pl-64">
                {/* Topbar */}
                <Topbar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />

                {/* Page content */}
                <main className="flex-1 p-4 overflow-y-auto text-black dark:text-white">
                    {children}
                </main>
            </div>
        </div>
    )
}
