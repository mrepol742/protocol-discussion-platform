import { useRef, useState } from 'react'
import Brand from '../../components/shared/Brand'
import { toast } from 'react-toastify'
import Input from '../../components/shared/Input'
import cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Login() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const formField = useRef<HTMLFormElement>(null)
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        const response = login(form.username, form.email, form.password)

        toast.promise(response, {
            pending: 'Logging in...',
            success: 'Login successful',
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message || error.response.data.error || 'Login failed'
                    )
                },
            },
        })

        // Save the token to cookies and redirect to home page
        response.then((response) => {
            const token = response.data.token
            cookies.set('auth_token', token, { expires: 7 })
            setForm({
                username: '',
                email: '',
                password: '',
            })
            formField.current?.reset()
            setLoading(false)
            setTimeout(() => {
                navigate('/')
            }, 1000)
        })

        // Handle any errors and reset loading state
        response.catch(() => {
            setLoading(false)
        })
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Brand />

            <div className="w-full max-w-md px-3">
                <div className="border rounded-lg p-6 mt-6">
                    <h2 className="text-center text-2xl font-semibold mb-6">
                        Login to Your Account
                    </h2>

                    <form onSubmit={onSubmit} ref={formField}>
                        <div
                            style={{
                                opacity: 0,
                                height: 0,
                                width: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <label htmlFor="username" className="block text-gray-700 mb-2">
                                Username
                            </label>
                            <Input
                                name="username"
                                type="username"
                                value={form.username}
                                placeholder="john.doe"
                                handleChange={handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 mb-2">
                                Email
                            </label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                placeholder="john.doe@example.com"
                                handleChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    placeholder="********"
                                    handleChange={handleChange}
                                    required
                                />

                                {form.password.length > 0 && (
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don’t have an account?{' '}
                        <a href="/auth/register" className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
