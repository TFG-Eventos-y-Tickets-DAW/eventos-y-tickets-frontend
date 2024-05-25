import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
    return (
        <div className="flex justify-center items-center bg-white px-2 gap-1 rounded-md border border-black lg:py-2 lg:text-3xl lg:justify-start lg:w-1/2 md:py-1 md:justify-start md:w-auto">
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="hover:text-accent-blue lg:text-4xl md:text-3xl cursor-pointer"
            />
            <input
                type="text"
                placeholder="Write here to search..."
                className="font-spectral p-1 outline-none text-sm lg:text-3xl md:text-3xl"
            />
        </div>
    );
}
