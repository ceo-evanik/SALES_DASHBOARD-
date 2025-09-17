'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Settings,
    Calendar,
    FileText,
    User,
    ChevronDown,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'


const adminItems = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        children: [
              { name: 'Dashboard', href: '/dashboard' },
            { name: 'gst_search', href: '/dashboard/gst-search' },
            { name: 'Analytics', href: '/dashboard/analytics' }
          
        ],
    },
    {
        name: 'Users',
        icon: Users,
        children: [
            { name: 'Allusers', href: '/dashboard/users' },
            { name: 'Create user', href: '/dashboard/users/create-user' },
        ],
    },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
]

const salesItems = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        children: [
            { name: 'gst_search', href: '/dashboard/gst-search' },
        ],
    },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function Sidebar({ role, isSideBarOpen, setIsSideBarOpen }: SidebarProps) {
    const pathname = usePathname()
    const menuItems = role === 'admin' ? adminItems : salesItems
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

    const toggleItem = (name: string) => {
        setOpenItems((prev) => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <aside className={`${isSideBarOpen ? "absolute" : "hidden"} h-screen z-10  lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0
            bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800`}>

            {/* Brand */}
            <div className="flex items-center justify-between h-16 px-6 font-bold text-lg border-b border-slate-200 dark:border-slate-800">
                {isSideBarOpen && <X onClick={() => setIsSideBarOpen(!isSideBarOpen)} />}
                <span className="text-indigo-600 dark:text-indigo-400">Evanik</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto text-sm">
                {menuItems.map((item) =>
                    item.children ? (
                        <div key={item.name} className="w-full">
                            <button
                                onClick={() => toggleItem(item.name)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 w-full transition-colors',
                                    openItems[item.name]
                                        ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-600 dark:text-white'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="flex-1 text-left">{item.name}</span>
                                <ChevronDown
                                    className={cn(
                                        'h-4 w-4 transition-transform duration-200',
                                        openItems[item.name] ? 'rotate-0' : '-rotate-90'
                                    )}
                                />
                            </button>

                            {openItems[item.name] && (
                                <div className="pl-10 space-y-1 mt-2">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            href={child.href}
                                            className={cn(
                                                'block rounded-md px-2 py-1 transition-colors',
                                                pathname === child.href
                                                    ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-600 dark:text-white'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                                            )}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            key={item.name}
                            href={item.href!}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                                pathname === item.href
                                    ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-600 dark:text-white'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="flex-1">{item.name}</span>
                        </Link>
                    )
                )}


            </nav>

        </aside>
    )
}
