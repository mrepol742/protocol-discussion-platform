import axiosInstance from '../axios'

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
export default function register(
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
