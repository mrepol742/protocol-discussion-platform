'use client'

import { useEffect, useState } from 'react'

/**
 * A hook for managing the theme of the application.
 *
 * @returns An object containing the current theme and a function to toggle it.
 */

export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const stored = localStorage.getItem('theme')
        if (stored === 'dark') {
            document.documentElement.classList.add('dark')
            setTheme('dark')
        } else {
            document.documentElement.classList.remove('dark')
            setTheme('light')
        }
    }, [])

    const toggleTheme = () => {
        if (theme === 'dark') {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
            setTheme('light')
        } else {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
            setTheme('dark')
        }
    }

    return { theme, toggleTheme }
}
