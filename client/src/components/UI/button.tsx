interface ButtonProps {
    variant: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    text: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const buttonColors = {
    "primary": "bg-[#5046e4] text-white hover:bg-[#3428EF] hover:scale-102 hover:text-white transform duration-300",
    "secondary": "bg-[#dee7fe] text-[#5046e4] hover:bg-[#C7D6FD] hover:scale-102 hover:text-[#3428EF] transform duration-300"
}

const defaultStyles = "rounded-lg cursor-pointer flex items-center m-1";

const sizeStyles = {
    "sm": "py-2 px-2",
    "md": "py-3 px-4",
    "lg": "py-4 px-6",
}

export const Button = (props: ButtonProps) => {
    return (
        <button onClick={props.onClick} className={`${buttonColors[props.variant]} ${defaultStyles} ${sizeStyles[props.size]} ${props.fullWidth? "w-full flex justify-center" : ""} ${props.loading? "opacity-40" : ""}`} disabled={props.loading}>
            {props.startIcon? <div className="pr-2">{props.startIcon}</div> : null} {props.text} {props.endIcon? <div className="pl-2">{props.endIcon}</div> : null}
        </button>
    )
}