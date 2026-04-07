import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Disable spinner globally
NProgress.configure({ showSpinner: false })

export default function TopLoader() {
    const location = useLocation()

    useEffect(() => {
        NProgress.start()
        const timer = setTimeout(() => {
            NProgress.done()
        }, 300)

        return () => clearTimeout(timer)
    }, [location])

    return null
}
