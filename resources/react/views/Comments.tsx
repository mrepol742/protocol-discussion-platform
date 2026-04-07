import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createComment, getComments } from '../services/comments'
import { getThreadInfo } from '../services/threads'
import { castVote } from '../services/votes'
import Loading from '../components/shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronLeft,
    faExclamationTriangle,
    faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import type { Response, ResponseNoPagination } from '../types/response'
import { useUser } from '../context/UserContext'
import CommentCard from '../components/card/CommentCard'
import ModalContainer from '../components/shared/ModalContainer'
import DeleteModal from '../components/modal/DeleteModal'
import CommentModal from '../components/modal/CommentModal'

export default function Comments() {
    const { threadId } = useParams<{ threadId: string }>()
    const [thread, setThread] = useState<any>(null)
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedComment, setSelectedComment] = useState({
        id: null,
        title: '', // cast as feedback but will keep as title for compatibility with delete modal
    })
    const commentsEndRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { user } = useUser()

    const fetchComments = async () => {
        const commentsResponse = (await getComments(Number(threadId))) as ResponseNoPagination
        setComments(commentsResponse.data)
    }

    const fetchThreadInfo = async () => {
        const threadInfoResponse = (await getThreadInfo(Number(threadId))) as Response
        setThread(threadInfoResponse.data)
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            await Promise.all([fetchThreadInfo(), fetchComments()])
        } catch (error) {
            console.error('Error fetching thread info or comments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [threadId])

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value)
    }

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return
        await createComment(threadId ?? '', newComment)
        setNewComment('')
        await fetchComments()
        scrollToBottom()
    }

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [comments])

    const voteComment = async (commentId: string, isUpvote: boolean) => {
        try {
            await castVote(Number(commentId), 'comment', isUpvote)
            await fetchComments()
        } catch (err) {
            console.error('Error voting:', err)
        }
    }

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
        <>
            <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CommentModal
                    form={selectedComment}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                />
            </ModalContainer>

            <ModalContainer isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DeleteModal
                    type="comment"
                    item={selectedComment}
                    isOpen={deleteModalOpen}
                    setIsOpen={setDeleteModalOpen}
                />
            </ModalContainer>

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(`/protocols/${thread.protocol_id}`)}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-gray-600 hover:text-gray-800 transition"
                    />
                    <span className="ms-2">Back</span>
                </button>

                <h1 className="text-4xl font-bold">{thread.title}</h1>
                <p className="text-lg text-gray-600 mb-2">{thread.body}</p>

                <div className="flex flex-col flex-1 min-h-0 border rounded-lg shadow-sm bg-white">
                    <h2 className="text-xl font-semibold p-4 border-b">
                        Comments ({thread.comments_count || comments.length})
                    </h2>

                    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2">
                        {comments.length === 0 && (
                            <p className="text-gray-500">
                                No comments yet. Be the first to comment!
                            </p>
                        )}

                        <ul className="space-y-3">
                            {comments.map((comment) => {
                                const votes = Array.isArray(comment.votes) ? comment.votes : []
                                const votesCount = votes.length
                                    ? votes.reduce(
                                          (sum: number, v: any) => sum + (v.is_upvote ? 1 : -1),
                                          0,
                                      )
                                    : 0
                                const myVote = votes.find(
                                    (v: any) => v.user_id === user?.id,
                                )?.is_upvote

                                return (
                                    <CommentCard
                                        key={comment.id}
                                        comment={comment}
                                        myVote={myVote}
                                        votesCount={votesCount}
                                        voteComment={voteComment}
                                        user={user}
                                        onUpdate={(comment) => {
                                            setSelectedComment({
                                                id: comment.id,
                                                title: comment.body,
                                            })
                                            setIsModalOpen(true)
                                        }}
                                        onDelete={(comment) => {
                                            setSelectedComment({
                                                id: comment.id,
                                                title: comment.body.substring(0, 20) + '...',
                                            })
                                            setDeleteModalOpen(true)
                                        }}
                                    />
                                )
                            })}
                        </ul>

                        <div ref={commentsEndRef} />
                    </div>

                    {user && (
                        <div className="rounded-xl flex flex-row items-end gap-2 p-2 border-t bg-white">
                            <textarea
                                className="flex-1 border rounded-xl p-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                                rows={3}
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={handleCommentChange}
                            />
                            <button
                                className="flex-shrink-0 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                onClick={handleCommentSubmit}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="mr-1" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
