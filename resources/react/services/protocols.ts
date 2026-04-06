import axiosInstance from '../lib/axios'

/**
 * Fetches a list of protocols based on the provided query and sorting options
 *
 * @param query - The search query to filter protocols (default: '')
 * @param isMostRecent - Whether to sort by most recent protocols
 * @param isMostReviews - Whether to sort by most reviewed protocols
 * @param isHighestRated - Whether to sort by highest rated or most sum upvotes protocols
 * @param page - The page number for pagination (default: 1)
 * @returns A promise that resolves with the response containing the list of protocols or rejects with an error
 */
export function getProtocols(
    query: string = '',
    isMostRecent: boolean,
    isMostReviews: boolean,
    isHighestRated: boolean,
    page: number = 1,
) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get('/protocols', {
                params: { q: query, isMostRecent, isMostReviews, isHighestRated, page },
            })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Fetches the details of a specific protocol by its ID
 *
 * @param protocolId - The ID of the protocol to fetch
 * @returns A promise that resolves with the response containing the protocol details or rejects with an error
 */
export function getProtocol(protocolId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/protocols/${protocolId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Creates a new protocol with the given title and content
 *
 * @param title - The title of the protocol to create
 * @param content - The content of the protocol to create
 * @param tags - An optional array of tags to associate with the protocol
 * @returns A promise that resolves with the response containing the created protocol or rejects with an error
 */
export function createProtocol(title: string, content: string, tags: string[] = []) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post('/protocols', { title, content, tags })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Updates an existing protocol with the given ID, title, and content
 *
 * @param protocolId - The ID of the protocol to update
 * @param title - The new title of the protocol
 * @param content - The new content of the protocol
 * @param tags - An optional array of new tags to associate with the protocol
 * @returns A promise that resolves with the response containing the updated protocol or rejects with an error
 */
export function updateProtocol(
    protocolId: number,
    title: string,
    content: string,
    tags: string[] = [],
) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .put(`/protocols/${protocolId}`, { title, content, tags })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Deletes a protocol with the given ID
 *
 * @param protocolId - The ID of the protocol to delete
 * @returns A promise that resolves with the response confirming deletion or rejects with an error
 */
export function deleteProtocol(protocolId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .delete(`/protocols/${protocolId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
