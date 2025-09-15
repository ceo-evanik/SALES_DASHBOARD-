'use client';

import { useState } from 'react';
import {
    Bell,
    Menu,
    Search,
    Settings,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';

interface TopbarProps {
    isSideBarOpen: boolean;
    setIsSideBarOpen: (value: boolean) => void;
}

export function Topbar({ isSideBarOpen, setIsSideBarOpen }: TopbarProps) {
    // const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4">
            {/* Mobile sidebar toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
            </Button>

            {/* Search bar */}
            <div className="flex flex-1 items-center max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search or type a command..."
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 pl-8 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 ml-4">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                        <DropdownMenuItem>New user registered</DropdownMenuItem>
                        <DropdownMenuItem>System update available</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme toggle */}
                <ThemeToggle />

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/avatar.png" alt="User" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline text-sm font-medium text-slate-900 dark:text-white">
                                John Doe
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                        <DropdownMenuItem className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
