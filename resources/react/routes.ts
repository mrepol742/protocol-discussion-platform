import { lazy } from 'react'
import type { Route } from './types/route'
import NotFound from './errors/NotFound'
const Logout = lazy(() => import('./views/auth/Logout'))
const Login = lazy(() => import('./views/auth/Login'))
const Register = lazy(() => import('./views/auth/Register'))
const Protocols = lazy(() => import('./views/Protocols'))
const Threads = lazy(() => import('./views/Threads'))
const Comments = lazy(() => import('./views/Comments'))

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
    {
        path: '/auth/logout',
        authRequired: true,
        isAuth: false,
        name: 'Logout',
        element: Logout,
    },

    // app routes
    {
        path: '/',
        authRequired: false,
        isAuth: false,
        name: 'Protocols',
        element: Protocols,
    },
    {
        path: 'protocols/:protocolId',
        authRequired: false,
        isAuth: false,
        name: 'Threads',
        element: Threads,
    },
    {
        path: 'protocols/:protocolId/threads/:threadId',
        authRequired: false,
        isAuth: false,
        name: 'Comments',
        element: Comments,
    },
    {
        path: '*',
        authRequired: false,
        isAuth: false,
        name: 'NotFound',
        element: NotFound,
    },
]

export default routes
