export type SearchProtocol = {
    /** The search query */
    search: string
    /** Whether to sort by most recent */
    mostRecent: boolean
    /** Whether to sort by most reviewed */
    mostReviewed: boolean
    /** Whether to show protocols from everyone or just your account (only signed user) */
    everyone: boolean
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
