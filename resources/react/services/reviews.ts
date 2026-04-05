import axiosInstance from '../lib/axios'

/**
 * Get reviews for a specific protocol.
 *
 * @param protocolId - The ID of the protocol to fetch reviews for.
 * @param page - The page number for pagination (optional, default is 1).
 * @returns A promise that resolves with the response containing the reviews data or rejects with an error.
 */
export function getReviews(protocolId: number, page: number = 1) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/reviews/${protocolId}`, { params: { page } })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Submit a new review for a specific protocol.
 *
 * @param protocolId - The ID of the protocol to which the review will be added. * @param feedback - The feedback of the review comment.
 * @param feedback - The content of the review comment.
 * @param rating - The rating value for the review (e.g., 1 to 5).
 * @returns A promise that resolves with the response containing the created review data or rejects with an error.
 */
export function submitReview(protocolId: number, feedback: string, rating: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post(`/reviews`, { protocol_id: protocolId, feedback, rating })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Delete a review from a specific protocol.
 *
 * @param protocolId - The ID of the protocol to which the review belongs.
 * @param reviewId - The ID of the review to be deleted.
 * @returns A promise that resolves with the response confirming the deletion or rejects with an error.
 */
export function deleteReview(protocolId: number, reviewId: number) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .delete(`/protocols/${protocolId}/reviews/${reviewId}`)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Update an existing review for a specific protocol.
 *
 * @param protocolId - The ID of the protocol to which the review belongs.
 * @param reviewId - The ID of the review to be updated.
 * @param rating - The updated rating value for the review (e.g., 1 to 5).
 * @param comment - The updated content of the review comment.
 * @returns A promise that resolves with the response containing the updated review data or rejects with an error.
 */
export function updateReview(
    protocolId: number,
    reviewId: number,
    rating: number,
    comment: string,
) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .put(`/protocols/${protocolId}/reviews/${reviewId}`, { rating, comment })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
