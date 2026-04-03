import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './views/home'

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
                    <Route path="*" element={<Home />} />
                </Routes>
            </Suspense>
        </Router>
    )
}
export default App
