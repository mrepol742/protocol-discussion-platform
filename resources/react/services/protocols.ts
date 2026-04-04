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
 * Creates a new protocol with the given title and description
 *
 * @param title - The title of the protocol to create
 * @param description - The description of the protocol to create
 * @returns A promise that resolves with the response containing the created protocol or rejects with an error
 */
export function createProtocol(title: string, description: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post('/protocols', { title, description })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Updates an existing protocol with the given ID, title, and description
 *
 * @param protocolId - The ID of the protocol to update
 * @param title - The new title of the protocol
 * @param description - The new description of the protocol
 * @returns A promise that resolves with the response containing the updated protocol or rejects with an error
 */
export function updateProtocol(protocolId: number, title: string, description: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .put(`/protocols/${protocolId}`, { title, description })
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
