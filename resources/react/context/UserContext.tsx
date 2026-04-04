import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, UserContextType } from '../types/user'
import cookies from 'js-cookie'
import { verifySession } from '../services/auth'

const UserContext = createContext<UserContextType | undefined>(undefined)

interface Props {
    children: ReactNode
}

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const isLoggedIn = !!cookies.get('auth_token')

    useEffect(() => {
        const fetchUser = async () => {
            if (!isLoggedIn) {
                setLoading(false)
                return
            }

            try {
                const response = await verifySession()
                setUser(response.data.user)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
