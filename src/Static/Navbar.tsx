import { Link } from "react-router-dom";
import Button from "../Utils/Button";
import Logo from "../Utils/Logo";
import avatar from "../assets/avatar_placeholder.png";

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-b from-secondary-black-lighter from-85% to-[#232424] flex justify-between items-center py-6 px-4">
            <Logo />
            {/* Navbar when user is not logged in */}
            {!localStorage.getItem("jwt") && (
                <div className="flex gap-2 justify-center items-center">
                    <Link to={"/login"}>
                        <Button
                            className="font-spectral bg-secondary-black-lighter text-white rounded-md py-1 px-2"
                            text="Sign In"
                        />
                    </Link>
                    <Button
                        className="font-spectral bg-accent-blue text-black rounded-md py-1 px-2"
                        text="Get Started"
                    />
                </div>
            )}
            {/* Navbar when user is logged in */}
            {localStorage.getItem("jwt") && (
                <div className="flex gap-2 justify-center items-center">
                    <Link to={"#"}>
                        <Button
                            className="font-spectral bg-accent-blue text-black rounded-md py-1 px-2"
                            text="My Events"
                        />
                    </Link>
                    <img src={avatar} alt="avatar-image" className="max-h-14" />
                </div>
            )}
        </nav>
    );
}
