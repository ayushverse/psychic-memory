import type {ReactNode} from "react";

interface ButtonProps {
    title: string,
    variant: "primary" | "secondary"
    size: "sm" | "md" | "lg"
    startIcon?: ReactNode
    endIcon?: ReactNode
}

const variantStyles = {
    "primary" : "bg-blue-500 text-white",
    "secondary" : "bg-gray-500 text-black"
}

const sizeStyles = {
    "sm" : "px-2 py-1 text-sm rounded-sm",
    "md" : "px-4 py-2 text-base rounded-md",
    "lg" : "px-6 py-3 text-lg rounded-xl"
}



export const Button = (props:ButtonProps) => {
    return <button
        className={`${sizeStyles[props.size]} ${variantStyles[props.variant]}`}
    >
        <div className="flex">
        {props.startIcon}
        {props.title}
        {props.endIcon}
        </div>
    </button>
}