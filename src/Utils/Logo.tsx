import logo from "../assets/logo_transparent.png";

interface MyLogoProps {
    className?: string;
}

export default function Logo({
    className = "max-h-4 cursor-pointer",
}: MyLogoProps) {
    return <img src={logo} alt="Here is a logo!" className={className} />;
}
