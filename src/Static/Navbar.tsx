import { Link } from "react-router-dom";
import Button from "../Utils/Button";
import Logo from "../Utils/Logo";

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-b from-secondary-black-lighter from-85% to-[#232424] flex justify-between items-center py-6 px-4">
            <Logo />
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
        </nav>
    );
}
