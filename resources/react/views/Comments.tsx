import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getComments } from '../services/comments'
import { getThreadInfo } from '../services/threads'
import Pagination from '../components/shared/Pagination'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function Comments() {
    const { threadId } = useParams<{ threadId: string }>()
    const [thread, setThread] = useState<any>(null)
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const fetchComments = async (page = 1) => {
        setLoading(true)
        try {
            const [threadResponse, commentsResponse] = await Promise.all([
                getThreadInfo(Number(threadId)),
                getComments(Number(threadId), page),
            ])
            setThread(threadResponse.data)

            setComments(commentsResponse.data.data)
            setCurrentPage(commentsResponse.data.current_page)
            setLastPage(commentsResponse.data.last_page)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [threadId, currentPage])

    if (loading) return <Loading />
    if (!thread)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-4xl text-yellow-500 mb-4"
                    />
                    <p className="text-gray-500">Thread not found.</p>
                    <small className="text-gray-400 block mt-2">
                        The thread you are looking for may have been removed or does not exist.
                    </small>
                </div>
            </div>
        )

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="border rounded-lg p-4 shadow-sm bg-white">
                <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
                <p className="text-gray-700">{thread.body}</p>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white">
                <h2 className="text-xl font-semibold mb-4">
                    Comments ({thread.comments_count || comments.length})
                </h2>

                {comments.length === 0 && (
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                )}

                <ul className="space-y-3">
                    {comments.map((comment) => (
                        <li
                            key={comment.id}
                            className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50 rounded"
                        >
                            <p className="text-gray-800">{comment.body}</p>
                            <span className="text-sm text-gray-500">— {comment.user.name}</span>
                            <small className="text-sm text-gray-400 block">
                                {new Date(comment.created_at).toLocaleString()}
                            </small>
                        </li>
                    ))}
                </ul>
            </div>

            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                loading={loading}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}
