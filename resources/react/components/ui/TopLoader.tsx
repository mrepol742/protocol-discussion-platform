import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function TopLoader() {
    const location = useLocation()

    useEffect(() => {
        NProgress.start()
        NProgress.done()
    }, [location])

    return null
}
