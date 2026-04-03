import { lazy } from 'react'
import type { Route } from './types/route'
const Login = lazy(() => import('./views/auth/Login'))
const Register = lazy(() => import('./views/auth/Register'))
const Home = lazy(() => import('./views/Home'))

const routes: Route[] = [
    // auth routes
    {
        path: '/auth/login',
        authRequired: false,
        isAuth: true,
        isFeatured: true,
        name: 'Login',
        element: Login,
    },
    {
        path: '/auth/register',
        authRequired: false,
        isAuth: true,
        isFeatured: true,
        name: 'Register',
        element: Register,
    },

    // app routes
    {
        path: '/',
        authRequired: false,
        isAuth: false,
        name: 'Protocols',
        element: Home,
    },
]

export default routes
