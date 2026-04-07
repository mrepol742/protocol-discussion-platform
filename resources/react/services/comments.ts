import axiosInstance from '../lib/axios'

/**
 * Get comments for a specific thread.
 *
 * @param threadId - The ID of the thread to fetch comments for.
 * @returns A promise that resolves with the response containing the comments data or rejects with an error.
 */
export function getComments(threadId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/comments/${threadId}`)
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
export function createComment(threadId: string, body: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post(`comments`, { thread_id: threadId, body })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Update an existing comment.
 *
 * @param commentId - The ID of the comment to be updated.
 * @param body - The new content for the comment.
 * @returns A promise that resolves with the response containing the updated comment data or rejects with an error.
 */
// cast title to body to recycle comment modal
export function updateComment(commentId: number, title: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .put(`/comments/${commentId}`, { body: title })
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
 * @param commentId - The ID of the comment to be deleted.
 * @returns A promise that resolves with the response confirming the deletion or rejects with an error.
 */
export function deleteComment(commentId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .delete(`/comments/${commentId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
