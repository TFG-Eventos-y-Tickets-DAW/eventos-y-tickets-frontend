import Footer from "./Static/Footer";
import Navbar from "./Static/Navbar";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function App() {
    return (
        <>
            <Navbar />
            <div className="bg-hero-image h-52 bg-cover flex flex-col items-center justify-center gap-4">
                <h1 className="font-karla font-bold text-white text-5xl text-center text-stroke-3">
                    What are you looking for?
                </h1>
                <div className="flex justify-center items-center bg-white px-2 gap-1 rounded-sm border border-black">
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
            </div>

            <Footer />
        </>
    );
}
export default App;
