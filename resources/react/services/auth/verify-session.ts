import axiosInstance from '../axios'

/**
 * Logs in a user with the provided credentials.
 *
 * @param username - The user's username.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise resolving to the login response or rejecting with an error.
 */
export default function verifySession() {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get('/auth/verify-session')
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
