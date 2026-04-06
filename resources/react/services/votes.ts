import axiosInstance from '../lib/axios'

/**
 * Casts a vote (upvote or downvote) on a thread or comment
 *
 * @param votableId - The ID of the thread or comment being voted on
 * @param voteType - The type of the votable item, either 'thread' or 'comment'
 * @param isUpvote - A boolean indicating whether the vote is an upvote (true) or a downvote (false)
 * @returns A promise that resolves with the response from the server after casting the vote or rejects with an error
 */
export function castVote(votableId: number, voteType: 'thread' | 'comment', isUpvote: boolean) {
    return axiosInstance.post('/vote', {
        votable_id: votableId,
        votable_type: voteType,
        is_upvote: isUpvote,
    })
}
