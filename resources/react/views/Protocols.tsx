import React, { useEffect, useState } from 'react'
import { getProtocols } from '../services/protocols'
import Pagination from '../components/shared/Pagination'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faExclamationTriangle,
    faGripVertical,
    faList,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import ProtocolModal from '../components/modal/ProtocolModal'
import ModalContainer from '../components/shared/ModalContainer'
import { useUser } from '../context/UserContext'
import ProtocolCard from '../components/card/ProtocolCard'
import Search from '../components/shared/Search'
import type { SearchProtocol } from '../types/search'
import type { Response } from '../types/response'
import { useViewPreference } from '../context/ViewPreference'
import DeleteModal from '../components/modal/DeleteModal'

const Home = () => {
    const [protocols, setProtocols] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create')
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedProtocol, setSelectedProtocol] = useState<any>({
        id: null,
        title: '',
        content: '',
        tags: [],
    })
    const { mode, toggleMode } = useViewPreference()
    const { user } = useUser()
    const navigate = useNavigate()
    const location = useLocation()

    const fetchProtocols = async (searchParams: SearchProtocol) => {
        setLoading(true)
        try {
            const response = (await getProtocols(
                searchParams.search,
                searchParams.mostRecent,
                searchParams.mostReviewed,
                searchParams.sort == 'topRated',
                searchParams.everyone,
                currentPage || 1,
            )) as Response
            setProtocols(response.data.data)
            setCurrentPage(response.data.current_page)
            setLastPage(response.data.last_page)
        } catch (error) {
            console.error('Error searching protocols:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)

        const q = params.get('q') || ''
        const mostRecent = params.get('recent') === 'true'
        const mostReviewed = params.get('reviewed') === 'true'
        const everyone = params.get('everyone') === 'true'
        const sort = params.get('sort') as 'topRated' | 'mostUpvotes' | null

        fetchProtocols({
            search: q,
            mostRecent,
            mostReviewed,
            everyone,
            sort: sort || 'topRated',
        })
    }, [location.search, currentPage])

    return (
        <>
            <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ProtocolModal
                    form={selectedProtocol}
                    modalAction={modalAction}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                />
            </ModalContainer>

            <ModalContainer isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DeleteModal
                    type="protocol"
                    item={selectedProtocol}
                    isOpen={deleteModalOpen}
                    setIsOpen={setDeleteModalOpen}
                />
            </ModalContainer>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <Search type="protocols" />

                    <div className="flex justify-end">
                        {user && (
                            <button
                                onClick={() => {
                                    setIsModalOpen(true)
                                    setModalAction('create')
                                    setSelectedProtocol({
                                        id: null,
                                        title: '',
                                        content: '',
                                        tags: [],
                                    })
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Protocol
                            </button>
                        )}

                        <button
                            onClick={toggleMode}
                            className="px-4 py-2 ml-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 transition"
                        >
                            {mode === 'list' ? (
                                <FontAwesomeIcon icon={faGripVertical} />
                            ) : (
                                <FontAwesomeIcon icon={faList} />
                            )}
                        </button>
                    </div>
                </div>

                {loading && <Loading />}

                {!loading && protocols.length == 0 && (
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
                )}

                <div
                    className={`grid gap-6 ${
                        mode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-1'
                    }`}
                >
                    {!loading &&
                        protocols.map((protocol: any) => (
                            <ProtocolCard
                                key={protocol.id}
                                protocol={protocol}
                                onClick={() => navigate(`/protocols/${protocol.id}`)}
                                onUpdate={(p) => {
                                    setSelectedProtocol(p)
                                    setModalAction('edit')
                                    setIsModalOpen(true)
                                }}
                                onDelete={(p) => {
                                    setSelectedProtocol(p)
                                    setDeleteModalOpen(true)
                                }}
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
