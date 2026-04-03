import axiosInstance from '../axios'

export default function login(username: string, email: string, password: string) {
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
