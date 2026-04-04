export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-lg text-gray-600">Page not found.</p>
                <small className="text-gray-400 block mt-2 mx-2">
                    The page you are looking for may have been removed or does not exist.
                </small>
            </div>
        </div>
    )
}
