import { Link } from "react-router-dom";
import Button from "../Utils/Button";
import Logo from "../Utils/Logo";
import avatar from "../../assets/avatar_placeholder.png";

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-b from-secondary-black-lighter from-85% to-[#232424] flex justify-between items-center py-6 px-4 lg:px-12 lg:py-8 md:px-12 md:py-8">
            <Link to={"/"}>
                <Logo />
            </Link>
            {/* Navbar when user is not logged in */}
            {!localStorage.getItem("jwt") && (
                <div className="flex gap-2 lg:gap-8 md:gap-6 justify-center items-center">
                    <Link to={"/login"}>
                        <Button
                            className="font-spectral bg-secondary-black-lighter text-white rounded-md py-1 px-2 lg:text-2xl md:text-xl cursor-pointer"
                            text="Sign In"
                        />
                    </Link>
                    <Link to={"/signin"}>
                        <Button
                            className="font-spectral bg-accent-blue text-black rounded-md py-1 px-2 lg:text-2xl lg:py-2 lg:px-4 md:text-xl md:py-2 md:px-3 cursor-pointer"
                            text="Get Started"
                        />
                    </Link>
                </div>
            )}
            {/* Navbar when user is logged in */}
            {localStorage.getItem("jwt") && (
                <div className="flex gap-3 lg:gap-8 md:gap-4 justify-center items-center">
                    <Link
                        to={"/user/tickets"}
                        className="hidden lg:inline-block md:inline-block"
                    >
                        <Button
                            className="font-spectral bg-secondary-black-lighter text-white rounded-md py-1 px-2 lg:text-2xl md:text-xl cursor-pointer"
                            text="My Tickets"
                        />
                    </Link>
                    <Link to={"user/events"}>
                        <Button
                            className="font-spectral bg-accent-blue text-black rounded-md py-1 px-2 lg:text-2xl lg:py-2 lg:px-4 md:text-xl md:py-2 md:px-4 cursor-pointer"
                            text="My Events"
                        />
                    </Link>
                    <Link to={"user/menu"}>
                        <img
                            src={avatar}
                            alt="avatar-image"
                            className="max-h-12"
                        />
                    </Link>
                </div>
            )}
        </nav>
    );
}
