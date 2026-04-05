import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

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
            className="border p-3 mb-2 rounded hover:scale-101 transition-transform cursor-pointer relative"
            onClick={onClick}
        >
            {/* Vote Section */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center px-2">
                <button
                    onClick={handleUpvote}
                    className="text-gray-400 hover:text-green-500 transition"
                >
                    ▲
                </button>
                <span className="text-sm font-medium">{votes}</span>
                <button
                    onClick={handleDownvote}
                    className="text-gray-400 hover:text-red-500 transition"
                >
                    ▼
                </button>
            </div>

            {/* Protocol Content */}
            <div className="ml-10 relative">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{protocol.title}</h2>
                <p className="text-gray-600 mb-2">{protocol.content}</p>

                <small className="text-gray-500">
                    by {protocol.author.name} on{' '}
                    {new Date(protocol.created_at).toLocaleDateString()}
                </small>

                {protocol.tags && protocol.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {protocol.tags.map((tag: string, idx: number) => (
                            <span
                                key={idx}
                                className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions Dropdown */}
                {(onUpdate || onDelete) && (
                    <div className="absolute top-0 right-0">
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
        </div>
    )
}

export default ProtocolCard
