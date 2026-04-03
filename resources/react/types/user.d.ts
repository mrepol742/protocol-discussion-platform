export type User = {
    id: string
    name: string
    email: string
}

export type UserContextType = {
    user: User | null
    setUser: (user: User | null) => void
    loading: boolean
}
