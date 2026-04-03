import { faLaravel } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Brand() {
    return (
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <FontAwesomeIcon icon={faLaravel} className="w-8 h-8 text-brand" />
            <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
                Discussions
            </span>
        </a>
    )
}
