interface MyButtonProps {
    className?: string;
    text?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

export default function Button({
    className = "",
    text = "Missing Text Prop",
    type = "button",
    onClick,
}: MyButtonProps) {
    return (
        <button className={className} type={type} onClick={onClick}>
            {text}
        </button>
    );
}
