import React from 'react'
import Navbar from '../components/ui/Navbar'

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="text-2xl">Hello World!</h1>
                <p>Your journey starts here. Goodluck!</p>
            </div>
        </>
    )
}

export default Home
