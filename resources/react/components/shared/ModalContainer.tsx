export default function ModalContainer({
    isOpen,
    setIsOpen,
    children,
}: {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    children: React.ReactNode
}) {
    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300  ${
                    isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            <div
                className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
            >
                <div
                    className={`relative rounded-2xl shadow-xl w-full max-w-lg p-6 z-10 transform transition-all duration-300 pointer-events-auto ${
                        isOpen
                            ? 'translate-y-0 scale-100 opacity-100'
                            : 'translate-y-8 scale-95 opacity-0'
                    }`}
                >
                    {children}
                </div>
            </div>
        </>
    )
}
