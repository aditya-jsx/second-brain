interface ButtonProps {
    variant: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    text: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick?: () => void;
}

const buttonColors = {
    "primary": "bg-[#5046e4] text-white hover:bg-[#3428EF] hover:scale-105 hover:text-white transform duration-300",
    "secondary": "bg-[#dee7fe] text-[#5046e4] hover:bg-[#C7D6FD] hover:scale-105 hover:text-[#3428EF] transform duration-300"
}

const defaultStyles = "rounded-lg cursor-pointer flex items-center m-1";

const sizeStyles = {
    "sm": "py-2 px-2",
    "md": "py-3 px-4",
    "lg": "py-4 px-6",
}

export const Button = (props: ButtonProps) => {
    return (
        <button className={`${buttonColors[props.variant]} ${defaultStyles} ${sizeStyles[props.size]}`}>
            {props.startIcon? <div className="pr-2">{props.startIcon}</div> : null} {props.text} {props.endIcon? <div className="pl-2">{props.endIcon}</div> : null}
        </button>
    )
}