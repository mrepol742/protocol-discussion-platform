import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import cookies from 'js-cookie'

export default function AuthLayout() {
    const isLoggedIn = cookies.get('auth_token')

    // If the user is already logged in, redirect to home page
    if (isLoggedIn) return (window.location.href = '/')

    return (
        <div className="min-h-screen flex flex-col background-grid">
            <Outlet />
            <ToastContainer />
        </div>
    )
}
