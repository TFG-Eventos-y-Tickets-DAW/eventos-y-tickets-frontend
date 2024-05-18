interface MyButtonProps {
    className?: string;
    text?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
}

export default function Button({
    className = "",
    text = "Missing Text Prop",
    type = "button",
    disabled = false,
    onClick,
}: MyButtonProps) {
    return (
        <button
            className={
                disabled
                    ? `${className} cursor-not-allowed opacity-50`
                    : className
            }
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}
