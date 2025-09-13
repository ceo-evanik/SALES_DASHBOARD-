import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-white dark:bg-slate-900">
            {/* Sidebar */}
            <Sidebar role="admin" />

            {/* Main content */}
            <div className="flex flex-1 flex-col lg:pl-64">
                {/* Topbar */}
                <Topbar />

                {/* Page content */}
                <main className="flex-1 p-4 overflow-y-auto text-black dark:text-white">
                    {children}
                </main>
            </div>
        </div>
    )
}
