import { useRef, useState } from 'react'
import Brand from '../../components/shared/Brand'
import { toast } from 'react-toastify'
import Input from '../../components/shared/Input'
import { register } from '../../services/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const formField = useRef<HTMLFormElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        const response = register(
            form.name,
            form.username,
            form.email,
            form.password,
            form.password_confirmation,
        )

        toast.promise(response, {
            pending: 'Registering...',
            success: 'Registration successful',
            error: {
                render({ data }) {
                    const error = data as Error
                    return (
                        error.response.data.message || error.response.data.error || 'Login failed'
                    )
                },
            },
        })

        // Clear the form and reset loading state
        response.then(() => {
            setForm({
                name: '',
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
            })
            formField.current?.reset()
            setLoading(false)
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
                    <h2 className="text-center text-2xl font-semibold mb-6">Create Your Account</h2>

                    <form onSubmit={onSubmit} ref={formField}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 mb-2">
                                Name
                            </label>
                            <Input
                                name="name"
                                type="text"
                                value={form.name}
                                placeholder="John Doe"
                                handleChange={handleChange}
                                required
                            />
                        </div>
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
                        <div className="mb-4">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-gray-700 mb-2"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Input
                                    name="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={form.password_confirmation}
                                    placeholder="********"
                                    handleChange={handleChange}
                                    required
                                />

                                {form.password_confirmation.length > 0 && (
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            Register
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{' '}
                        <a href="/auth/login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
