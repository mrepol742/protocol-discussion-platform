import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getThreads } from '../services/threads'
import { getProtocol } from '../services/protocols'
import Pagination from '../components/shared/Pagination'
import { getReviews } from '../services/reviews'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronLeft,
    faExclamationTriangle,
    faGripVertical,
    faList,
    faPencil,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import ModalContainer from '../components/shared/ModalContainer'
import ThreadModal from '../components/modal/ThreadModal'
import { useUser } from '../context/UserContext'
import ThreadCard from '../components/card/ThreadCard'
import ReviewModal from '../components/modal/ReviewModal'
import type { Response } from '../types/response'
import Search from '../components/shared/Search'
import type { SearchThread } from '../types/search'
import { Rating } from 'react-simple-star-rating'
import DeleteModal from '../components/modal/DeleteModal'

export default function Threads() {
    const [mode, setMode] = useState('list')
    const { protocolId } = useParams<{ protocolId: string }>()
    const [protocol, setProtocol] = useState<any>(null)
    const [threads, setThreads] = useState<any[]>([])
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [threadCurrentPage, setThreadCurrentPage] = useState(1)
    const [threadLastPage, setThreadLastPage] = useState(1)
    const [reviewCurrentPage, setReviewCurrentPage] = useState(1)
    const [reviewLastPage, setReviewLastPage] = useState(1)
    const [isThreadModalOpen, setIsThreadModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [modalThreadAction, setModalThreadAction] = useState<'create' | 'edit'>('create')
    const [selectedThread, setSelectedThread] = useState({
        protocol_id: -1,
        id: -1,
        title: '',
        body: '',
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [modalReviewAction, setModalReviewAction] = useState<'create' | 'edit'>('create')
    const [selectedReview, setSelectedReview] = useState({
        protocol_id: -1,
        user_id: -1,
        rating: 0,
        feedback: '',
    })
    const { user } = useUser()
    const navigate = useNavigate()
    const location = useLocation()

    const toggleMode = () => {
        setMode((prev) => (prev === 'list' ? 'grid' : 'list'))
    }

    const fetchThreads = async (searchParams: SearchThread) => {
        setLoading(true)
        if (!protocolId) return

        const threadsResponse = (await getThreads(
            Number(protocolId),
            searchParams.search,
            searchParams.mostRecent,
            searchParams.topRated,
            threadCurrentPage,
        )) as Response
        setThreads(threadsResponse.data.data)
        setThreadCurrentPage(threadsResponse.data.current_page)
        setThreadLastPage(threadsResponse.data.last_page)
        setLoading(false)
    }

    const fetchReviews = async () => {
        if (!protocolId) return
        const reviewsResponse = (await getReviews(
            Number(protocolId),
            reviewCurrentPage,
        )) as Response

        setReviews(reviewsResponse.data.data)
        setReviewCurrentPage(reviewsResponse.data.current_page)
        setReviewLastPage(reviewsResponse.data.last_page)
    }

    const fetchProtocol = async () => {
        if (!protocolId) return

        const protocolResponse = (await getProtocol(Number(protocolId))) as Response
        setProtocol(protocolResponse.data)
    }

    const fetchAll = async () => {
        setLoading(true)
        try {
            await Promise.all([fetchProtocol(), fetchReviews()])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleResize = () => {
            console.log(window.innerWidth)
            if (window.innerWidth <= 550 && mode === 'list') {
                toggleMode()
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [mode, toggleMode])

    useEffect(() => {
        fetchAll()
    }, [protocolId, reviewCurrentPage])

    useEffect(() => {
        const params = new URLSearchParams(location.search)

        const q = params.get('q') || ''
        const mostRecent = params.get('recent') === 'true'
        const topRated = params.get('topRated') === 'true'

        setSearchTerm(q)
        fetchThreads({
            search: q,
            mostRecent,
            topRated,
        })
    }, [location.search, threadCurrentPage])

    if (!protocol)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-4xl text-yellow-500 mb-4"
                    />
                    <p className="text-gray-500">Protocol not found.</p>
                    <small className="text-gray-400 block mt-2">
                        The protocol you are looking for may have been removed or does not exist.
                    </small>
                </div>
            </div>
        )

    return (
        <>
            <ModalContainer isOpen={isThreadModalOpen} onClose={() => setIsThreadModalOpen(false)}>
                <ThreadModal
                    form={selectedThread}
                    modalAction={modalThreadAction}
                    isOpen={isThreadModalOpen}
                    setIsOpen={setIsThreadModalOpen}
                />
            </ModalContainer>

            <ModalContainer isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
                <ReviewModal
                    form={selectedReview}
                    modalAction={modalReviewAction}
                    isOpen={isReviewModalOpen}
                    setIsOpen={setIsReviewModalOpen}
                    fetchReviews={fetchReviews}
                />
            </ModalContainer>

            <ModalContainer isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DeleteModal
                    type="thread"
                    item={selectedThread}
                    isOpen={deleteModalOpen}
                    setIsOpen={setDeleteModalOpen}
                />
            </ModalContainer>

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-gray-600 hover:text-gray-800 transition"
                    />
                    <span className="ms-2 ">Back</span>
                </button>
                <h1 className="text-4xl font-bold">{protocol.title}</h1>

                <p className="text-lg text-gray-600">{protocol.content}</p>
                <div className="text-sm text-gray-500 block mb-2">
                    {protocol.author.name} — {new Date(protocol.created_at).toLocaleDateString()}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <Search type="threads" />

                    <div className="flex justify-end">
                        {user && user.id === protocol.author_id && (
                            <button
                                onClick={() => {
                                    setIsThreadModalOpen(true)
                                    setModalThreadAction('create')
                                    setSelectedThread({
                                        protocol_id: Number(protocolId),
                                        id: -1,
                                        title: '',
                                        body: '',
                                    })
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Thread
                            </button>
                        )}
                        <button
                            onClick={toggleMode}
                            className="hidden md:inline-block px-4 py-2 ml-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 transition"
                        >
                            {mode === 'list' ? (
                                <FontAwesomeIcon icon={faGripVertical} />
                            ) : (
                                <FontAwesomeIcon icon={faList} />
                            )}
                        </button>
                    </div>
                </div>

                {loading && <Loading noMaxHeight />}

                {!loading && threads.length === 0 && (
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="text-4xl text-yellow-500 mb-4"
                            />
                            <p className="text-gray-500">No threads found.</p>
                            <small className="text-gray-400 block mt-2">
                                {searchTerm.length > 0
                                    ? 'No threads match your search criteria.'
                                    : 'There are currently no threads for this protocol.'}
                            </small>
                        </div>
                    </div>
                )}

                <div
                    className={`grid gap-6 ${
                        mode === 'grid'
                            ? 'md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-2 md:grid-cols-1'
                    }`}
                >
                    {!loading &&
                        threads.map((thread) => (
                            <ThreadCard
                                key={thread.id}
                                isOwner={user?.id === protocol.author_id}
                                thread={thread}
                                onClick={() =>
                                    navigate(`/protocols/${protocol.id}/threads/${thread.id}`)
                                }
                                onUpdate={(t) => {
                                    setSelectedThread({
                                        protocol_id: Number(protocolId),
                                        id: Number(t.id),
                                        title: t.title,
                                        body: t.body,
                                    })
                                    setModalThreadAction('edit')
                                    setIsThreadModalOpen(true)
                                }}
                                onDelete={(t) => {
                                    setSelectedThread({
                                        protocol_id: Number(protocolId),
                                        id: Number(t.id),
                                        title: t.title,
                                        body: t.body,
                                    })
                                    setDeleteModalOpen(true)
                                }}
                            />
                        ))}
                </div>

                {threadLastPage > 1 && (
                    <Pagination
                        currentPage={threadCurrentPage}
                        lastPage={threadLastPage}
                        loading={loading}
                        setCurrentPage={setThreadCurrentPage}
                    />
                )}

                <div className="border-t my-6" />

                <div className="flex justify-between items-center my-2">
                    <h2 className="text-2xl font-semibold">Review</h2>
                    {user && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setIsReviewModalOpen(true)
                                    setModalReviewAction(
                                        reviews.some((r) => r.user_id === user.id)
                                            ? 'edit'
                                            : 'create',
                                    )
                                    setSelectedReview({
                                        protocol_id: Number(protocolId),
                                        user_id: Number(user.id),
                                        rating: 0,
                                        feedback: '',
                                    })
                                    const existingReview = reviews.find(
                                        (r) => r.user_id === user.id,
                                    )

                                    setIsReviewModalOpen(true)
                                    setModalReviewAction(existingReview ? 'edit' : 'create')

                                    setSelectedReview(
                                        existingReview
                                            ? {
                                                  protocol_id: Number(existingReview.protocol_id),
                                                  user_id: Number(existingReview.user_id),
                                                  rating: Number(existingReview.rating),
                                                  feedback: existingReview.feedback || '',
                                              }
                                            : {
                                                  protocol_id: Number(protocolId),
                                                  user_id: Number(user.id),
                                                  rating: 0,
                                                  feedback: '',
                                              },
                                    )
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition"
                            >
                                <FontAwesomeIcon icon={faPencil} className="mr-1" />
                                Review
                            </button>
                        </div>
                    )}
                </div>

                {reviews.length === 0 && (
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="text-4xl text-yellow-500 mb-4"
                            />
                            <p className="text-gray-500">No reviews found.</p>
                            <small className="text-gray-400 block mt-2">
                                There are currently no reviews for this protocol.
                            </small>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="hover:border-l-yellow-500 border-l-3 border-gray-500 rounded ps-2 transition"
                        >
                            {review.user_id === user?.id && (
                                <div className="mb-1 bg-gray-600 w-min whitespace-nowrap text-white rounded text-xs px-2">
                                    Your review
                                </div>
                            )}
                            <h3 className="font-semibold">{review.user.name}</h3>
                            <p className="text-gray-600">{review.feedback}</p>

                            <div className="mt-1">
                                <Rating
                                    initialValue={review.rating}
                                    allowHover={false}
                                    disableFillHover
                                    readonly={true}
                                    allowFraction
                                    SVGstyle={{
                                        width: '16px',
                                        height: '16px',
                                        display: 'inline-block',
                                    }}
                                    fillStyle={{ display: 'inline-block' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {reviewLastPage > 1 && (
                    <Pagination
                        currentPage={reviewCurrentPage}
                        lastPage={reviewLastPage}
                        loading={loading}
                        setCurrentPage={setReviewCurrentPage}
                    />
                )}
            </div>
        </>
    )
}
