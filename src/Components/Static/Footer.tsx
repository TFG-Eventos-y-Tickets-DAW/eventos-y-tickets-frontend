import Logo from "../Utils/Logo";

export default function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center gap-4 font-spectral text-white text-md bg-secondary-black-lighter px-4 py-6 lg:py-10 md:py-10">
            <div className="flex flex-col justify-center items-center text-xs gap-2 lg:text-lg md:text-base">
                <Logo />
                <p>Copyright © 2024 Event&Greet</p>
            </div>

            <ul className="flex text-[9.5px] items-center justify-center text-accent-blue underline gap-1.5 lg:text-lg lg:gap-6 md:text-base md:gap-6">
                <li className="flex items-center justify-center">
                    <a href="#">Legal Stuff</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Privacy Policy</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Security</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Website Accesibility</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Manage Cookies</a>
                </li>
            </ul>
        </footer>
    );
}
