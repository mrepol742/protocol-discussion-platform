import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col background-grid">
            <Outlet />
            <ToastContainer />
        </div>
    )
}
