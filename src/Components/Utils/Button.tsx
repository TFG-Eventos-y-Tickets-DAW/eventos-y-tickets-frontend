import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MyButtonProps {
    className?: string;
    text?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    isLoadingText?: string;
}

export default function Button({
    className = "",
    text = "Missing Text Prop",
    type = "button",
    disabled = false,
    isLoading = false,
    isLoadingText = "Loading...",
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
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <div className="flex gap-2 items-center justify-center">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin"
                    />{" "}
                    {isLoadingText}
                </div>
            ) : (
                text
            )}
        </button>
    );
}
