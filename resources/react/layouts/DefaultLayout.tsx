import { Outlet } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'

export default function DefaultLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <Outlet />
        </div>
    )
}
