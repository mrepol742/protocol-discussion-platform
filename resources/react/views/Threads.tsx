import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getThreads } from '../services/threads'
import { getProtocol } from '../services/protocols'
import Pagination from '../components/shared/Pagination'
import { getReviews } from '../services/reviews'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import ModalContainer from '../components/shared/ModalContainer'
import ThreadModal from '../components/modal/ThreadModal'
import { useUser } from '../context/UserContext'
import ThreadCard from '../components/card/ThreadCard'
import ReviewModal from '../components/modal/ReviewModal'

export default function Threads() {
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
    const [modalThreadAction, setModalThreadAction] = useState<'create' | 'edit'>('create')
    const [selectedThread, setSelectedThread] = useState({
        protocol_id: -1,
        title: '',
        body: '',
    })
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

    const fetchThreads = async () => {
        if (!protocolId) return

        const threadsResponse = await getThreads(Number(protocolId), threadCurrentPage)
        setThreads(threadsResponse.data.data)
        setThreadCurrentPage(threadsResponse.data.current_page)
        setThreadLastPage(threadsResponse.data.last_page)
    }

    const fetchReviews = async () => {
        if (!protocolId) return
        const reviewsResponse = await getReviews(Number(protocolId), threadCurrentPage)

        setReviews(reviewsResponse.data.data)
        setReviewCurrentPage(reviewsResponse.data.current_page)
        setReviewLastPage(reviewsResponse.data.last_page)
    }

    const fetchProtocol = async () => {
        if (!protocolId) return

        const protocolResponse = await getProtocol(Number(protocolId))
        setProtocol(protocolResponse.data)
    }

    const fetchAll = async () => {
        setLoading(true)
        try {
            await Promise.all([fetchProtocol(), fetchThreads(), fetchReviews()])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAll()
    }, [protocolId, threadCurrentPage])

    if (loading) return <Loading />
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
                    fetchThreads={fetchThreads}
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

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-2">{protocol.title}</h1>
                <p className="text-lg text-gray-600 mb-2">{protocol.content}</p>
                <small className="text-sm text-gray-500 block mb-1">
                    By: {protocol.author.name}
                </small>
                <small className="text-sm text-gray-500 block mb-4">
                    Created on: {new Date(protocol.created_at).toLocaleDateString()}
                </small>

                <div className="flex justify-between items-center my-2">
                    <h2 className="text-2xl font-semibold">Threads</h2>
                    {user && (
                        <div className="flex justify-end mb-3">
                            <button
                                onClick={() => {
                                    setIsThreadModalOpen(true)
                                    setModalThreadAction('create')
                                    setSelectedThread({
                                        protocol_id: Number(protocolId),
                                        title: '',
                                        body: '',
                                    })
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                            >
                                Create Thread
                            </button>
                        </div>
                    )}
                </div>

                {threads.length === 0 && <p>No threads found.</p>}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {threads.map((thread) => (
                        <ThreadCard
                            key={thread.id}
                            thread={thread}
                            onClick={() =>
                                navigate(`/protocols/${protocol.id}/threads/${thread.id}`)
                            }
                            onUpvote={(t) => console.log('Upvote', t)}
                            onDownvote={(t) => console.log('Downvote', t)}
                            onUpdate={(t) => console.log('Update', t)}
                            onDelete={(t) => console.log('Delete', t)}
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
                        <div className="flex justify-end mb-3">
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                            >
                                {reviews.some((r) => r.user_id === user.id)
                                    ? 'Edit Review'
                                    : 'Write Review'}
                            </button>
                        </div>
                    )}
                </div>

                {reviews.length === 0 && <p>No reviews found.</p>}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {reviews.map((review) => (
                        <div key={review.id} className="border p-3 mb-2 rounded">
                            <h3 className="font-semibold">{review.user.name}</h3>
                            <p className="text-gray-600">{review.feedback}</p>
                            <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
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
