import { faEllipsisVertical, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

interface Comment {
    id: string
    user: { name: string }
    body: string
}

interface Thread {
    id: string
    title: string
    body: string
    votes?: number
    comments?: Comment[]
}

interface ThreadCardProps {
    thread: Thread
    onUpvote?: (thread: Thread) => void
    onDownvote?: (thread: Thread) => void
    onUpdate?: (thread: Thread) => void
    onDelete?: (thread: Thread) => void
    onClick?: () => void
}

const ThreadCard: React.FC<ThreadCardProps> = ({
    thread,
    onUpvote,
    onDownvote,
    onUpdate,
    onDelete,
    onClick,
}) => {
    const [votes, setVotes] = useState(thread.votes || 0)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation()
        setVotes(votes + 1)
        onUpvote?.(thread)
    }

    const handleDownvote = (e: React.MouseEvent) => {
        e.stopPropagation()
        setVotes(votes - 1)
        onDownvote?.(thread)
    }

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDropdownOpen(!dropdownOpen)
    }

    return (
        <div
            className="border rounded-lg p-4 relative hover:shadow-lg transition-shadow cursor-pointer flex"
            onClick={onClick}
        >
            {/* Votes */}
            <div className="flex flex-col items-center mr-4 select-none">
                <button
                    onClick={handleUpvote}
                    className="text-gray-400 hover:text-green-500 transition text-xl"
                >
                    ▲
                </button>
                <span className="font-semibold">{votes}</span>
                <button
                    onClick={handleDownvote}
                    className="text-gray-400 hover:text-red-500 transition text-xl"
                >
                    ▼
                </button>
            </div>

            {/* Thread content */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 text-lg">{thread.title}</h3>

                    {/* Action dropdown */}
                    {(onUpdate || onDelete) && (
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
