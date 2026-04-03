import { useState } from 'react'
import Brand from '../../components/ui/Brand'

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Brand />

            <div className="w-full max-w-md px-3">
                <div className="border rounded-lg p-6 mt-6">
                    <h2 className="text-center text-2xl font-semibold mb-6">Create Your Account</h2>

                    <form onSubmit={onSubmit}>
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
                            <input
                                type="username"
                                id="username"
                                onChange={handleChange}
                                name="username"
                                value={form.username}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                onChange={handleChange}
                                name="email"
                                value={form.email}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={handleChange}
                                name="password"
                                value={form.password}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                onChange={handleChange}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
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
