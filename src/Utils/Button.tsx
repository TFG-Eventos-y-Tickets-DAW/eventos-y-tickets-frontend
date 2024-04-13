interface MyButtonProps {
    className?: string;
    text?: string;
    type?: "button" | "submit" | "reset";
}

export default function Button({
    className = "",
    text = "Missing Text Prop",
    type = "button",
}: MyButtonProps) {
    return (
        <button className={className} type={type}>
            {text}
        </button>
    );
}
