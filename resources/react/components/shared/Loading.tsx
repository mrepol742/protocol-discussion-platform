export default function Loading({ noMaxHeight = false }: { noMaxHeight?: boolean }) {
    return (
        <div className={`flex justify-center items-center ${!noMaxHeight ? 'min-h-screen' : ''}`}>
            <div className="w-10 h-10 border-4 border-gray-600 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
    )
}
