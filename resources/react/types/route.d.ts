export type Route = {
    /** The path of the route, e.g. '/auth/login' */
    path: string

    /** Whether the route requires authentication */
    authRequired: boolean

    /** Whether the route is an auth route. If true, the route will be rendered under the AuthLayout, otherwise it will be rendered under the DefaultLayout. */
    isAuth: boolean

    /** Whether the route is featured. If true, the route will be rendered in the navbar. */
    isFeatured?: boolean

    /** The name of the route, e.g. 'Login' */
    name: string

    /** The component to render when the route is accessed, e.g. Login */
    element: React.ComponentType
}
