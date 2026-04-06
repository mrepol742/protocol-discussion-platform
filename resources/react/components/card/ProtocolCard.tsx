import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useUser } from '../../context/UserContext'

interface ProtocolCardProps {
    protocol: any
    onUpdate?: (protocol: any) => void
    onDelete?: (protocol: any) => void
    onClick?: () => void
    onUpvote?: (protocol: any) => void
    onDownvote?: (protocol: any) => void
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({
    protocol,
    onUpdate,
    onDelete,
    onClick,
    onUpvote,
    onDownvote,
}) => {
    const [votes, setVotes] = useState(protocol.votes || 0)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { user } = useUser()

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation()
        setVotes(votes + 1)
        onUpvote?.(protocol)
    }

    const handleDownvote = (e: React.MouseEvent) => {
        e.stopPropagation()
        setVotes(votes - 1)
        onDownvote?.(protocol)
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
            <div className="flex-1">
                <div className="flex justify-between items-start border p-2 rounded-lg mb-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{protocol.title}</h2>
                        {/* the *1000 is to convert unix timestamp strtotime($this->created_at) to readable date */}
                        <div className="text-gray-500 text-xs">
                            {protocol?.author?.name || protocol.author_name} —{' '}
                            {new Date(protocol.created_at * 1000).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Actions Dropdown */}
                    {user && protocol.author_id == user?.id && (onUpdate || onDelete) && (
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
                                            onUpdate(protocol)
                                            setDropdownOpen(false)
                                        }}
                                    >
                                        Update
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(protocol)
                                            setDropdownOpen(false)
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 mb-2">{protocol.content}</p>

                {protocol.tags && protocol.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {protocol.tags.map((tag: string, idx: number) => (
                            <span
                                key={idx}
                                className="text-sm bg-blue-100 text-blue-800 px-4 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProtocolCard
