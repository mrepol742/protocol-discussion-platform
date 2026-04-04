import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getThreads } from '../services/threads'
import { getProtocol } from '../services/protocols'
import Pagination from '../components/shared/Pagination'
import { getReviews } from '../services/reviews'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

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
    const navigate = useNavigate()

    const fetchData = async () => {
        if (!protocolId) return
        setLoading(true)

        try {
            const [protocolResponse, threadsResponse, reviewsResponse] = await Promise.all([
                getProtocol(Number(protocolId)),
                getThreads(Number(protocolId), threadCurrentPage),
                getReviews(Number(protocolId), threadCurrentPage),
            ])
            setProtocol(protocolResponse.data)

            setThreads(threadsResponse.data.data)
            setThreadCurrentPage(threadsResponse.data.current_page)
            setThreadLastPage(threadsResponse.data.last_page)

            setReviews(reviewsResponse.data.data)
            setReviewCurrentPage(reviewsResponse.data.current_page)
            setReviewLastPage(reviewsResponse.data.last_page)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
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
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-2">{protocol.title}</h1>
            <p className="text-lg text-gray-600 mb-2">{protocol.content}</p>
            <small className="text-sm text-gray-500 block mb-1">By: {protocol.author.name}</small>
            <small className="text-sm text-gray-500 block mb-4">
                Created on: {new Date(protocol.created_at).toLocaleDateString()}
            </small>

            <h2 className="text-2xl font-semibold mb-2">Threads</h2>
            {threads.length === 0 && <p>No threads found.</p>}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {threads.map((thread) => (
                    <div
                        key={thread.id}
                        className="border p-3 mb-2 rounded hover:scale-101 transition-transform cursor-pointer"
                        onClick={() => navigate(`/protocols/${protocol.id}/threads/${thread.id}`)}
                    >
                        <h3 className="font-semibold">{thread.title}</h3>
                        <p className="text-gray-600">{thread.body}</p>

                        {thread.comments && thread.comments.length > 0 && (
                            <ul className="mt-2 ml-4 border-l-2 border-gray-200 pl-2">
                                {thread.comments.map((comment: any) => (
                                    <li key={comment.id} className="mb-1">
                                        <strong>{comment.user.name}:</strong> {comment.body}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={threadCurrentPage}
                lastPage={threadLastPage}
                loading={loading}
                setCurrentPage={setThreadCurrentPage}
            />

            <h2 className="text-2xl font-semibold mb-2">Reviews</h2>

            {reviews.length === 0 && <p>No reviews found.</p>}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {reviews.map((review) => (
                    <div key={review.id} className="border p-3 mb-2 rounded">
                        <h3 className="font-semibold">{review.user.name}</h3>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={reviewCurrentPage}
                lastPage={reviewLastPage}
                loading={loading}
                setCurrentPage={setReviewCurrentPage}
            />
        </div>
    )
}
