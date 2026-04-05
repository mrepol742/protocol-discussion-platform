import React, { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import { getProtocols } from '../services/protocols'
import Pagination from '../components/shared/Pagination'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import ProtocolModal from '../components/modal/ProtocolModal'
import ModalContainer from '../components/shared/ModalContainer'
import { useUser } from '../context/UserContext'
import ProtocolCard from '../components/card/ProtocolCard'

const Home = () => {
    const [protocols, setProtocols] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create')
    const [selectedProtocol, setSelectedProtocol] = useState<any>({
        title: '',
        content: '',
        tags: [],
    })
    const { user } = useUser()
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
            <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ProtocolModal
                    form={selectedProtocol}
                    modalAction={modalAction}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    fetchProtocols={fetchProtocols}
                />
            </ModalContainer>

            <div className="container mx-auto px-4 py-8">
                {user && (
                    <div className="flex justify-end mb-3">
                        <button
                            onClick={() => {
                                setIsModalOpen(true)
                                setModalAction('create')
                                setSelectedProtocol({
                                    title: '',
                                    content: '',
                                    tags: [],
                                })
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                        >
                            Create Protocol
                        </button>
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {protocols.map((protocol: any) => (
                        <ProtocolCard
                            key={protocol.id}
                            protocol={protocol}
                            onClick={() => navigate(`/protocols/${protocol.id}`)}
                            onUpdate={(p) => console.log('Update', p)}
                            onDelete={(p) => console.log('Delete', p)}
                        />
                    ))}
                </div>

                {lastPage > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        loading={loading}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
        </>
    )
}

export default Home
