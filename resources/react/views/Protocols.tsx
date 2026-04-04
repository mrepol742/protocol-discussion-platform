import React, { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import { getProtocols } from '../services/protocols'
import Pagination from '../components/shared/Pagination'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
    const [protocols, setProtocols] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchProtocols = async (page = 1) => {
        setLoading(true)
        try {
            const response = await getProtocols(page)
            setProtocols(response.data.data)
            setCurrentPage(response.data.current_page)
            setLastPage(response.data.last_page)
        } catch (error) {
            console.error('Error fetching protocols:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProtocols(currentPage)
    }, [currentPage])

    if (loading) return <Loading />
    if (!protocols)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-4xl text-yellow-500 mb-4"
                    />
                    <p className="text-gray-500">No protocols found.</p>
                    <small className="text-gray-400 block mt-2">
                        There are currently no protocols available. Please check back later.
                    </small>
                </div>
            </div>
        )

    return (
        <>
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {protocols.map((protocol: any) => (
                        <div
                            key={protocol.id}
                            className="border p-3 mb-2 rounded hover:scale-101 transition-transform cursor-pointer"
                            onClick={() => navigate(`/protocols/${protocol.id}`)}
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                {protocol.title}
                            </h2>
                            <p className="text-gray-600 mb-2">{protocol.content}</p>

                            <small className="text-gray-500">
                                by {protocol.author.name} on{' '}
                                {new Date(protocol.created_at).toLocaleDateString()}
                            </small>

                            {protocol.tags && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {protocol.tags.map((tag: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    loading={loading}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </>
    )
}

export default Home
