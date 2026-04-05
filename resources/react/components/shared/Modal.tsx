import { useEffect } from 'react'

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
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
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}
