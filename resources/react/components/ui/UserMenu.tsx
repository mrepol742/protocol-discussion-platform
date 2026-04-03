import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserMenu({ user }) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="relative inline-block text-left me-2 md:me-0" ref={menuRef}>
            {user && (
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-center w-10 h-10 ms-4 text-sm font-medium text-white bg-gray-800 rounded-full focus:outline-none"
                >
                    {user.name[0]}
                </button>
            )}

            <div
                className={`absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 transform transition-all duration-200 ease-out origin-top-right
                      ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    `}
            >
                <div className="py-1">
                    <button
                        onClick={() => {
                            setOpen(false)
                            navigate('/auth/logout')
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
