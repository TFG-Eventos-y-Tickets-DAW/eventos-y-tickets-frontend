import SearchBar from "../../../Utils/SearchBar";

export default function Hero() {
    return (
        <div className="bg-hero-image h-52 bg-cover flex flex-col items-center justify-center gap-4">
            <h1 className="font-karla font-bold text-white text-5xl text-center text-stroke-3">
                What are you looking for?
            </h1>
            <SearchBar />
        </div>
    );
}
