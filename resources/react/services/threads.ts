import axiosInstance from '../lib/axios'

/**
 * Fetches a list of threads associated with a specific protocol by its ID
 *
 * @param protocolId - The ID of the protocol for which to fetch threads
 * @returns A promise that resolves with the response containing the list of threads or rejects with an error
 */
export function getThreads(protocolId: number, page: number = 1) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/threads/${protocolId}`, { params: { page } })
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
 * Creates a new thread under a specific protocol with the given title and content
 *
 * @param protocolId - The ID of the protocol under which to create the thread
 * @param title - The title of the thread to create
 * @param content - The content of the thread to create
 * @returns A promise that resolves with the response containing the created thread or rejects with an error
 */
export function createThread(protocolId: number, title: string, content: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post(`/protocols/${protocolId}/threads`, { title, content })
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
 * @param protocolId - The ID of the protocol from which to delete the thread
 * @param threadId - The ID of the thread to delete
 * @returns A promise that resolves with the response confirming the deletion or rejects with an error
 */
export function deleteThread(protocolId: number, threadId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .delete(`/protocols/${protocolId}/threads/${threadId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Updates the title and content of a specific thread by its ID under a specific protocol
 *
 * @param protocolId - The ID of the protocol to which the thread belongs
 * @param threadId - The ID of the thread to update
 * @param title - The new title for the thread
 * @param content - The new content for the thread
 * @returns A promise that resolves with the response containing the updated thread or rejects with an error
 */
export function updateThread(protocolId: number, threadId: number, title: string, content: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .put(`/protocols/${protocolId}/threads/${threadId}`, { title, content })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
