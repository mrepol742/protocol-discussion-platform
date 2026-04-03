import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import AuthLayout from './layouts/AuthLayout'
import routes from './routes'

const App: React.FC = () => {
    return (
        <Router>
            <Suspense
                fallback={
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="w-10 h-10 border-4 border-gray-600 border-t-gray-800 rounded-full animate-spin"></div>
                    </div>
                }
            >
                <Routes>
                    <Route path="/auth" element={<AuthLayout />}>
                        {routes.map((route, index) => (
                            <>
                                {route.isAuth && (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={<route.element />}
                                    />
                                )}
                            </>
                        ))}
                    </Route>

                    <Route path="/" element={<DefaultLayout />}>
                        {routes.map((route, index) => (
                            <>
                                {!route.isAuth && (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={<route.element />}
                                    />
                                )}
                            </>
                        ))}
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    )
}
export default App
