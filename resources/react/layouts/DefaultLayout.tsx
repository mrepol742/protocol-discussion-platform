import { Outlet } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import { ToastContainer } from 'react-toastify'
import Footer from '../components/ui/Footer'

export default function DefaultLayout() {
    return (
        <div className="min-h-screen flex flex-col background-grid">
            <Navbar />
            <Outlet />
            <Footer />
            <ToastContainer />
        </div>
    )
}
