import { useEffect } from 'react'

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    isLoading,
    children,
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    isLoading: boolean
    children: React.ReactNode
}) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transform transition-all duration-300 opacity-100">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>

                <div className="mb-4">{children}</div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded transition ${
                            isLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Close
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded transition ${
                            isLoading
                                ? 'bg-blue-300 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}
