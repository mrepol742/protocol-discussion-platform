import axiosInstance from '../lib/axios'

/**
 * Fetches a list of threads associated with a specific protocol by its ID
 *
 * @param protocolId - The ID of the protocol for which to fetch threads
 * @returns A promise that resolves with the response containing the list of threads or rejects with an error
 */
export function getThreads(
    protocolId: number,
    query: string = '',
    isMostRecent: boolean,
    topRated: boolean,
    page: number = 1,
) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/threads/${protocolId}`, { params: { q: query, isMostRecent, topRated, page } })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Fetches the details of a specific thread by its ID
 *
 * @param threadId - The ID of the thread to fetch
 * @returns A promise that resolves with the response containing the thread details or rejects with an error
 */
export function getThread(threadId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/threads/${threadId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Fetches the information of a specific thread by its ID, which may include metadata such as the number of comments, creation date, and last updated date
 *
 * @param threadId - The ID of the thread for which to fetch information
 * @returns A promise that resolves with the response containing the thread information or rejects with an error
 */
export function getThreadInfo(threadId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/threads/${threadId}/info`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Creates a new thread under a specific protocol with the given title and body
 *
 * @param protocolId - The ID of the protocol under which to create the thread
 * @param title - The title of the thread to create
 * @param body - The body of the thread to create
 * @returns A promise that resolves with the response containing the created thread or rejects with an error
 */
export function createThread(protocolId: number, title: string, body: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post(`/threads`, { protocol_id: protocolId, title, body })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Updates the title and body of a specific thread by its ID under a specific protocol
 *
 * @param threadId - The ID of the thread to update
 * @param title - The new title for the thread
 * @param body - The new body for the thread
 * @returns A promise that resolves with the response containing the updated thread or rejects with an error
 */
export function updateThread(threadId: number, title: string, body: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .put(`/threads/${threadId}`, { title, body })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Deletes a specific thread by its ID from a specific protocol
 *
 * @param threadId - The ID of the thread to delete
 * @returns A promise that resolves with the response confirming the deletion or rejects with an error
 */
export function deleteThread(threadId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .delete(`/threads/${threadId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
