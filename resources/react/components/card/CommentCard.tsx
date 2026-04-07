import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Display individual comments with voting functionality.
 *
 * @param comment - The comment object containing the comment text, user information, and timestamps.
 * @param myVote - The current user's vote on the comment (1 for upvote, 0 for downvote, -1 for no vote).
 * @param votesCount - The total number of votes the comment has received.
 * @param voteComment - A function to handle voting on the comment, accepting the comment ID and whether it's an upvote or downvote.
 * @param user - The currently logged-in user to determine if the comment belongs to them.
 * @param onUpdate - Optional callback function to handle comment updates, triggered when the edit action is selected.
 * @param onDelete - Optional callback function to handle comment deletion, triggered when the delete action is selected.
 * @returns A styled list item component displaying the comment details, user information, and voting buttons.
 */
export default function CommentCard({
    comment,
    myVote,
    votesCount,
    voteComment,
    user,
    onUpdate,
    onDelete,
}: {
    comment: any
    myVote: number
    votesCount: number
    voteComment: (commentId: string, isUpvote: boolean) => Promise<void>
    user: any
    onUpdate?: (comment: any) => void
    onDelete?: (comment: any) => void
}) {
    return (
        <li className="py-2 bg-gray-50 rounded flex relative">
            {comment.user_id === user?.id && (
                <div className="absolute top-1 right-2 flex gap-2 text-md">
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => onUpdate && onUpdate(comment)}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                    </button>

                    <button
                        className="text-gray-500  hover:text-gray-700"
                        onClick={() => onDelete && onDelete(comment)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            )}

            <div className="flex flex-col items-center mr-4 select-none">
                <button
                    onClick={() => voteComment(comment.id, true)}
                    className={`text-xl transition ${
                        myVote === 1 ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                    }`}
                >
                    ▲
                </button>
                <span className="font-semibold">{votesCount}</span>
                <button
                    onClick={() => voteComment(comment.id, false)}
                    className={`text-xl transition ${
                        myVote === 0 ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                >
                    ▼
                </button>
            </div>

            <div>
                <p className="text-gray-800">{comment.body}</p>
                <span className="text-sm text-gray-500">
                    — {user?.id === comment.user.id ? 'You' : comment.user.name}
                </span>
                <small className="text-sm text-gray-400 block">
                    {new Date(comment.created_at).toLocaleString()}
                </small>
            </div>
        </li>
    )
}
