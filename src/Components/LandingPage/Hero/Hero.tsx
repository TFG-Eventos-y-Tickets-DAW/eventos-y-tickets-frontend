import SearchBar from "../../../Utils/SearchBar";
import heroImg from "../../../assets/Hero.jpg";

export default function Hero() {
    return (
        <div className="relative">
            <img src={heroImg} alt="Here should be a hero image." />
            <div className="absolute bottom-[0.5px] h-52 flex flex-col items-center justify-center gap-4">
                <h1 className="font-karla font-bold text-white text-5xl text-center text-stroke-3">
                    What are you looking for?
                </h1>
                <SearchBar />
            </div>
        </div>
    );
}
