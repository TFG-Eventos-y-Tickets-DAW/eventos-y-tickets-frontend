import SearchBar from "../../Utils/SearchBar";
import heroImg from "../../../assets/Hero.jpg";

export default function Hero() {
    return (
        <div className="relative">
            <img
                src={heroImg}
                alt="Here should be a hero image."
                className="w-full"
            />
            <div className="pb-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-52 flex flex-col items-center justify-center gap-3">
                <h1 className="font-karla font-bold text-white text-5xl text-center text-stroke-3">
                    What are you looking for?
                </h1>
                <SearchBar />
            </div>
        </div>
    );
}
