import { useEffect } from 'react'
import cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/auth'

export default function Logout() {
    const isLoggedIn = !cookies.get('auth_token')
    const navigate = useNavigate()

    if (isLoggedIn) return navigate('/')

    const handleLogout = () => {
        if (isLoggedIn) return

        logout()
            .then((response) => {
                cookies.remove('auth_token')
                window.location.href = '/'
            })
            .catch((error) => {
                console.error('Logout failed:', error)
            })
    }

    useEffect(() => {
        handleLogout()
    }, [])

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-2xl">You have been logged out.</h1>
            <p>Thank you for using our platform. See you next time!</p>
        </div>
    )
}
