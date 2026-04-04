import axiosInstance from '../lib/axios'

/**
 * Logs in a user with the provided credentials.
 *
 * @param username - The user's username.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise resolving to the login response or rejecting with an error.
 */
export function login(username: string, email: string, password: string) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post('/auth/login', { username, email, password })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Registers a new user with the provided details.
 *
 * @param name - The user's name.
 * @param username - The user's username.
 * @param email - The user's email.
 * @param password - The user's password.
 * @param confirmPassword - The user's password confirmation.
 * @returns A promise resolving to the registration response or rejecting with an error.
 */
export function register(
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
) {
    return new Promise((resolve, reject) => {
        axiosInstance
            .post('/auth/register', {
                name,
                username,
                email,
                password,
                password_confirmation: confirmPassword,
            })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function verifySession() {
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

export function logout() {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get('/auth/logout')
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
