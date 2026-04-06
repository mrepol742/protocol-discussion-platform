import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import type { SearchProtocol } from '../../types/search'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

/**
 * Search component for protocols and threads with debounced input and filter options.
 *
 * @param type - Determines whether the search is for 'protocols' or 'threads', which affects the available filters and placeholder text.
 * Filters include:
 * - Most Recent: Toggles the 'recent' query parameter to show the most recently created items.
 * - Most Reviewed (protocols only): Toggles the 'reviewed' query parameter to show items with the most reviews.
 * - Top Rated (threads only): Toggles the 'upvoted' query parameter to show threads with the most upvotes.
 * - Everyone (protocols only): Toggles the 'everyone' query parameter to show threads from all users. (for logged in users only)
 * - Sort Dropdown (protocols only): Allows sorting by 'Top Rated' or 'Most Upvotes', which sets the 'sort' query parameter accordingly.
 *
 * The component uses debouncing to delay the search term update until the user has stopped typing for 300ms, reducing unnecessary updates and API calls.
 * @returns
 */
export default function Search({ type }: { type: 'protocols' | 'threads' }) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedTerm, setDebouncedTerm] = useState('')
    const [isMostRecent, setIsMostRecent] = useState(false)
    const [isMostReviewed, setIsMostReviewed] = useState(false)
    const [isMostUpvoted, setIsMostUpvoted] = useState(false)
    const [isEveryone, setIsEveryone] = useState(false)
    const [sortType, setSortType] = useState<'topRated' | 'mostUpvotes'>('topRated')
    const [initialized, setInitialized] = useState(false)
    const navigate = useNavigate()
    const { user } = useUser()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        const q = params.get('q') || ''
        const mostRecent = params.get('recent') === 'true'
        const mostReviewed = params.get('reviewed') === 'true'
        const mostUpvoted = params.get('upvoted') === 'true'
        const everyone = params.get('everyone') === 'true'
        const sort = params.get('sort') as 'topRated' | 'mostUpvotes' | null

        setSearchTerm(q)
        setDebouncedTerm(q)
        setIsMostRecent(mostRecent)
        setIsMostReviewed(mostReviewed)
        setIsMostUpvoted(mostUpvoted)
        setIsEveryone(everyone)
        if (sort) setSortType(sort)

        setInitialized(true)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    useEffect(() => {
        if (!initialized) return

        const params = new URLSearchParams()

        if (debouncedTerm) params.set('q', debouncedTerm)
        if (isMostRecent) params.set('recent', 'true')
        if (isMostReviewed) params.set('reviewed', 'true')
        if (isMostUpvoted) params.set('upvoted', 'true')
        if (isEveryone) params.set('everyone', 'true')
        if (sortType && type === 'protocols') params.set('sort', sortType)

        navigate(`?${params.toString()}`)
    }, [
        debouncedTerm,
        isMostRecent,
        isMostReviewed,
        isMostUpvoted,
        isEveryone,
        sortType,
        initialized,
    ])

    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-4 md:mb-0">
            <div className="flex items-center w-full max-w-md px-4 rounded-md py-2 border bg-gray-100 flex-1">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${type === 'protocols' ? 'protocols' : 'threads'}...`}
                    className="flex-1 text-gray-700 focus:outline-none"
                />

                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="ml-2 bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-2 mt-2 md:mt-0">
                <button
                    onClick={() => {
                        setIsMostRecent(!isMostRecent)
                    }}
                    className={`px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-300 transition whitespace-nowrap ${
                        isMostRecent ? 'bg-gray-300' : ''
                    }`}
                >
                    Most Recent
                </button>

                {type === 'threads' && (
                    <button
                        onClick={() => {
                            setIsMostUpvoted(!isMostUpvoted)
                        }}
                        className={`px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-300 transition whitespace-nowrap ${
                            isMostUpvoted ? 'bg-gray-300' : ''
                        }`}
                    >
                        Top Rated
                    </button>
                )}

                {type === 'protocols' && (
                    <>
                        <button
                            onClick={() => {
                                setIsMostReviewed(!isMostReviewed)
                            }}
                            className={`px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-300 transition whitespace-nowrap ${
                                isMostReviewed ? 'bg-gray-300' : ''
                            }`}
                        >
                            Most Reviews
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="w-40 px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-300 transition whitespace-nowrap"
                            >
                                {sortType === 'topRated' ? 'Top Rated' : 'Most Upvotes'} ▼
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <button
                                        onClick={() => {
                                            setSortType('topRated')
                                            setOpen(false)
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 whitespace-nowrap"
                                    >
                                        Top Rated
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSortType('mostUpvotes')
                                            setOpen(false)
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 whitespace-nowrap"
                                    >
                                        Most Upvotes
                                    </button>
                                </div>
                            )}
                        </div>

                        {user && (
                            <button
                                onClick={() => {
                                    setIsEveryone(!isEveryone)
                                }}
                                className={`px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-300 transition whitespace-nowrap ${
                                    isEveryone ? 'bg-gray-300' : ''
                                }`}
                            >
                                Everyone
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
