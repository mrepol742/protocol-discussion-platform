import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { createComment, getComments } from '../services/comments'
import { getThreadInfo } from '../services/threads'
import Pagination from '../components/shared/Pagination'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import type { Response } from '../types/response'

export default function Comments() {
    const { threadId } = useParams<{ threadId: string }>()
    const [thread, setThread] = useState<any>(null)
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [newComment, setNewComment] = useState('')
    const commentsEndRef = useRef<HTMLDivElement>(null)

    const fetchComments = async (page = 1) => {
        const commentsResponse = (await getComments(Number(threadId), page)) as Response
        setComments(commentsResponse.data.data)
        setCurrentPage(commentsResponse.data.current_page)
        setLastPage(commentsResponse.data.last_page)
    }

    const fetchThreadInfo = async () => {
        const threadInfoResponse = (await getThreadInfo(Number(threadId))) as Response
        setThread(threadInfoResponse.data)
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            await Promise.all([fetchThreadInfo(), fetchComments(currentPage)])
        } catch (error) {
            console.error('Error fetching thread info or comments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [threadId, currentPage])

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value)
    }

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return
        createComment(threadId ? threadId : '', newComment)
        setNewComment('')
        fetchComments()
        scrollToBottom()
    }

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [comments])

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
        <div className="h-screen flex flex-col container mx-auto px-4 py-4 overflow-hidden">
            <div className="mb-4">
                <h1 className="text-4xl font-bold mb-2">{thread.title}</h1>
                <p className="text-lg text-gray-600 mb-2">{thread.body}</p>
                <small className="text-sm text-gray-500 block">
                    Created on: {new Date(thread.created_at).toLocaleDateString()}
                </small>
            </div>

            <div className="flex flex-col flex-1 min-h-0 border rounded-lg shadow-sm bg-white">
                <h2 className="text-xl font-semibold p-4 border-b">
                    Comments ({thread.comments_count || comments.length})
                </h2>

                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2">
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

                    <div ref={commentsEndRef} />
                </div>

                {lastPage > 1 && (
                    <div className="px-4 py-2 border-t">
                        <Pagination
                            currentPage={currentPage}
                            lastPage={lastPage}
                            loading={loading}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}

                <div className="p-4 border-t bg-white">
                    <textarea
                        className="w-full border rounded p-2 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        onClick={handleCommentSubmit}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}
