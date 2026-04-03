import axiosInstance from '../axios'

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
