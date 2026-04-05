import axiosInstance from '../lib/axios'

/**
 * Fetches a list of protocols
 *
 * @param page - The page number to fetch (default is 1)
 * @returns A promise that resolves with the response containing the list of protocols or rejects with an error
 */
export function getProtocols(page: number = 1) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get('/protocols?page=' + page)
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
export function updateProtocol(protocolId: number, title: string, content: string, tags: string[] = []) {
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
