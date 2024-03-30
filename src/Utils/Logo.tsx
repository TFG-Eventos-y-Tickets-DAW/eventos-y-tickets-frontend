interface MyLogoProps {
    className?: string;
}

export default function Logo({
    className = "max-h-4 cursor-pointer",
}: MyLogoProps) {
    return (
        <img
            src="src\assets\logo_transparent.png"
            alt="Here is a logo!"
            className={className}
        />
    );
}
