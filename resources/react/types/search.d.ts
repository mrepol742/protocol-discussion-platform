export type SearchProtocol = {
    /** The search query */
    search: string
    /** Whether to sort by most recent */
    mostRecent: boolean
    /** Whether to sort by most reviewed */
    mostReviewed: boolean
    /** The sort type */
    sort: 'topRated' | 'mostUpvotes'
}

export type SearchThread = {
    /** The search query */
    search: string
    /** Whether to sort by most recent */
    mostRecent: boolean
    /** Whether to sort by vote count */
    topRated: boolean
}
