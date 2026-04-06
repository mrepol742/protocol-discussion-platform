import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import routes from '../../routes'
import Brand from '../shared/Brand'
import cookies from 'js-cookie'
import { useUser } from '../../context/UserContext'
import UserMenu from './UserMenu'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isLoggedIn = !!cookies.get('auth_token')
    const { user } = useUser()
    const navRef = useRef(null)

    const toggleMenu = () => setIsMenuOpen((prev) => !prev)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('pointerdown', handleClickOutside)
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside)
        }
    }, [])

    return (
        <nav
            ref={navRef}
            className="bg-white fixed w-full z-20 top-0 start-0 border-b border-default"
        >
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Brand />

                <div className="flex items-center md:order-2">
                    <UserMenu user={user} />

                    {!isLoggedIn && (
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
                            aria-controls="navbar-search"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {!isLoggedIn && (
                    <div
                        className={`w-full md:flex md:w-auto md:order-1 transition-all duration-300 ease-out transform origin-top
                        ${
                            isMenuOpen
                                ? 'opacity-100 scale-y-100 max-h-screen'
                                : 'opacity-0 scale-y-0 max-h-0 overflow-hidden'
                        }
                        md:opacity-100 md:scale-y-100 md:max-h-full md:overflow-visible
                      `}
                        id="navbar-search"
                    >
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                            {routes
                                .filter((route) => route.isFeatured)
                                .map((route, index) => (
                                    <li key={index}>
                                        <a
                                            href={route.path}
                                            className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0"
                                        >
                                            {route.name}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}
