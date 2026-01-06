import type {ReactNode} from "react";

export interface buttonProps {
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick: () => void;
}


const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-md",
    lg: "px-6 py-3 text-lg"
};

const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
};

const Button = ({ variant, size, text, startIcon, endIcon, onClick }: buttonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded transition-all ${variantStyles[variant]} ${sizeStyles[size]}`}
        >
            {startIcon && <span className="flex items-center">{startIcon}</span>}
            {text}
            {endIcon && <span className="flex items-center">{endIcon}</span>}
        </button>
    );
};

export default Button;