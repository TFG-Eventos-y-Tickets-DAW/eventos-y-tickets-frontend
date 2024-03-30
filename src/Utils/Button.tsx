interface MyButtonProps {
    className?: string;
    text?: string;
}

export default function Button({
    className = "",
    text = "Missing Text Prop",
}: MyButtonProps) {
    return <button className={className}>{text}</button>;
}
