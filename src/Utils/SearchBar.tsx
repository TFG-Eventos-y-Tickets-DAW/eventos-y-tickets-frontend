import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
    return (
        <div className="flex justify-center items-center bg-white px-2 gap-1 rounded-md border border-black">
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="hover:text-accent-blue"
            />
            <input
                type="text"
                placeholder="Write here to search..."
                className="font-spectral p-1 outline-none text-sm"
            />
        </div>
    );
}
