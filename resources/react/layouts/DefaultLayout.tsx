import { Outlet } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import { ToastContainer } from 'react-toastify'
import Footer from '../components/ui/Footer'
import cookies from 'js-cookie'
import { UserProvider } from '../context/UserContext'

export default function DefaultLayout() {
    const isLoggedIn = !cookies.get('auth_token')

    return (
        <UserProvider>
            <div className="min-h-screen flex flex-col background-grid">
                <Navbar />

                <div className="min-h-screen pt-16">
                    <Outlet />
                </div>

                {isLoggedIn && <Footer />}

                <ToastContainer />
            </div>
        </UserProvider>
    )
}
