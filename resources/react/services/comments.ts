import axiosInstance from '../lib/axios'

/**
 * Get comments for a specific thread.
 *
 * @param threadId - The ID of the thread to fetch comments for.
 * @param page - The page number for pagination (optional, default is 1).
 * @returns A promise that resolves with the response containing the comments data or rejects with an error.
 */
export function getComments(threadId: number, page: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/comments/${threadId}`, { params: { page } })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Create a new comment in a specific thread.
 *
 * @param protocolId - The ID of the protocol to which the thread belongs.
 * @param threadId - The ID of the thread to which the comment will be added.
 * @param content - The content of the comment to be created.
 * @returns A promise that resolves with the response containing the created comment data or rejects with an error.
 */
export function createComment(protocolId: string, threadId: string, content: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post(`/protocols/${protocolId}/threads/${threadId}/comments`, { content })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Delete a comment from a specific thread.
 *
 * @param protocolId - The ID of the protocol to which the thread belongs.
 * @param threadId - The ID of the thread from which the comment will be deleted.
 * @param commentId - The ID of the comment to be deleted.
 * @returns A promise that resolves with the response confirming the deletion or rejects with an error.
 */
export function deleteComment(protocolId: string, threadId: string, commentId: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .delete(`/protocols/${protocolId}/threads/${threadId}/comments/${commentId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
