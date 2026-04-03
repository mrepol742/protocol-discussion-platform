import Brand from '../shared/Brand'

export default function Footer() {
    return (
        <footer className="bg-neutral-primary-soft rounded-base shadow-xs border border-default m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Brand />

                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-body sm:mb-0">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Privacy
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Terms
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Cookies
                            </a>
                        </li>
                    </ul>
                </div>

                <hr className="my-6 border-default sm:mx-auto lg:my-8" />
                <span className="block text-sm text-body sm:text-center">
                    © {new Date().getFullYear()} Melvin Jones Repol. All Rights Reserved.
                </span>
            </div>
        </footer>
    )
}
