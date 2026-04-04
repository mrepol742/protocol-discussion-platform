import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import AuthLayout from './layouts/AuthLayout'
import routes from './routes'
import Loading from './components/shared/Loading'
import ErrorBoundary from './errors/ErrorBoundary'
import ScrollToTop from './components/ui/ScrollToTop'
import ScrollTop from './components/ui/ScrollTop'

const App: React.FC = () => {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <ErrorBoundary>
                    <ScrollToTop />
                    <ScrollTop />

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
                </ErrorBoundary>
            </Suspense>
        </Router>
    )
}
export default App
