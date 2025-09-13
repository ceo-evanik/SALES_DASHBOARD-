"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"

const themes = ["light", "dark", "system"] as const

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Fix hydration mismatch (next-themes requirement)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    // Get next theme in cycle
    const handleToggle = () => {
        const currentIndex = themes.indexOf(theme as typeof themes[number])
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        setTheme(nextTheme)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="relative"
        >
            {/* Light */}
            <Sun
                className={`h-5 w-5 transition-all ${theme === "light" ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
            />
            {/* Dark */}
            <Moon
                className={`absolute h-5 w-5 transition-all ${theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
            />
            {/* System */}
            <Laptop
                className={`absolute h-5 w-5 transition-all ${theme === "system" ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
