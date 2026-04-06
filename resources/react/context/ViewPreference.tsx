import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ViewContextType } from '../types/view'

const ViewContext = createContext<ViewContextType | null>(null)

interface Props {
    children: ReactNode
}

export const ViewPreference = ({ children }: Props) => {
    const [mode, setMode] = useState('grid')

    useEffect(() => {
        const saved = localStorage.getItem('viewMode')
        if (saved) setMode(saved)
    }, [])

    useEffect(() => {
        localStorage.setItem('viewMode', mode)
    }, [mode])

    const toggleMode = () => {
        setMode((prev) => (prev === 'grid' ? 'list' : 'grid'))
    }

    return <ViewContext.Provider value={{ mode, toggleMode }}>{children}</ViewContext.Provider>
}

export const useViewPreference = () => useContext(ViewContext)
