import { faEllipsisVertical, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { castVote } from '../../services/votes'
import { toast } from 'react-toastify'
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

interface Comment {
    id: string
    user: { name: string }
    body: string
}

interface Thread {
    id: string
    title: string
    body: string
    votes_count?: number
    votes: { user_id: string; is_upvote: boolean }[]
    comments?: Comment[]
}

interface ThreadCardProps {
    isOwner: boolean
    thread: Thread
    onUpdate?: (thread: Thread) => void
    onDelete?: (thread: Thread) => void
    onClick?: () => void
}

const ThreadCard: React.FC<ThreadCardProps> = ({
    isOwner,
    thread,
    onClick,
    onUpdate,
    onDelete,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { user } = useUser()
    const navigate = useNavigate()
    const votes = Array.isArray(thread.votes) ? thread.votes : []
    const myVote = votes.find((vote) => Number(vote.user_id) === Number(user?.id))?.is_upvote
    const votesCount = votes.length
        ? votes.reduce((sum: number, v: any) => sum + (v.is_upvote ? 1 : -1), 0)
        : 0

    const voteThread = async (threadId: string, isUpvote: boolean) => {
        try {
            await castVote(Number(threadId), 'thread', isUpvote)
            navigate(0) // Refresh the page to update the vote count and myVote status
        } catch (err) {
            console.error('Error voting:', err)
        }
    }

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDropdownOpen(!dropdownOpen)
    }

    return (
        <div className="border rounded-lg p-4 relative hover:shadow-lg transition-shadow cursor-pointer flex">
            <div className="flex flex-col items-center mr-4 select-none">
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        voteThread(thread.id, true)
                    }}
                    className={`text-xl transition ${
                        myVote ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                    }`}
                >
                    ▲
                </button>
                <span className="font-semibold">{votesCount}</span>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        voteThread(thread.id, false)
                    }}
                    className={`text-xl transition ${
                        !myVote ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                >
                    ▼
                </button>
            </div>

            <div className="flex-1" onClick={onClick}>
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 text-lg">{thread.title}</h3>

                    {isOwner && (onUpdate || onDelete) && (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="px-2 py-1 rounded-full hover:bg-gray-300 transition"
                            >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>

                            <div
                                className={`absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-50
                                    ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                                `}
                            >
                                {onUpdate && (
                                    <button
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onUpdate(thread)
                                            setDropdownOpen(false)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPencil} className="me-1" /> Update
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(thread)
                                            setDropdownOpen(false)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="me-1" /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 mt-1">{thread.body}</p>

                {thread.comments && thread.comments.length > 0 && (
                    <ul className="mt-3 border-l-2 border-gray-200 pl-3 space-y-1">
                        {thread.comments.map((comment) => (
                            <li key={comment.id}>
                                <strong>{comment.user.name}:</strong> {comment.body}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default ThreadCard
