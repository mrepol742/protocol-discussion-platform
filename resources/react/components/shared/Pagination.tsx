/**
 * Pagination component to navigate through pages of data.
 *
 * @param currentPage The current page number.
 * @param lastPage The last page number available.
 * @param loading Whether the data is currently being loaded (used to disable buttons).
 * @param setCurrentPage Function to update the current page number when a page button is clicked.
 * @returns A pagination UI with "Prev" and "Next" buttons, as well as numbered page buttons, with ellipses for skipped pages.
 */
export default function Pagination({
    currentPage,
    lastPage,
    loading,
    setCurrentPage,
}: {
    currentPage: number
    lastPage: number
    loading: boolean
    setCurrentPage: (page: number) => void
}) {
    const pages = []
    const maxVisible = 5
    let start = Math.max(currentPage - 2, 1)
    let end = Math.min(start + maxVisible - 1, lastPage)
    if (end - start < maxVisible - 1) start = Math.max(end - maxVisible + 1, 1)

    for (let i = start; i <= end; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded-md border ${
                    currentPage === i
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                {i}
            </button>,
        )
    }

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
                Prev
            </button>

            {start > 1 && <span className="px-2">...</span>}

            {pages}

            {end < lastPage && <span className="px-2">...</span>}

            <button
                disabled={currentPage === lastPage || loading}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    )
}
