interface ButtonProps {
    variant: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    text: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick?: () => void;
}

const buttonColors = {
    "primary": "bg-[#5046e4] text-white",
    "secondary": "bg-[#dee7fe] text-[#5046e4]"
}

const defaultStyles = "rounded-lg cursor-pointer flex m-1";

const sizeStyles = {
    "sm": "py-2 px-2",
    "md": "py-3 px-4",
    "lg": "py-4 px-6",
}

export const Button = (props: ButtonProps) => {
    return (
        <button className={`${buttonColors[props.variant]} ${defaultStyles} ${sizeStyles[props.size]}`}>
            {props.startIcon? <div className="pr-2">{props.startIcon}</div> : null} {props.text} {props.endIcon? <div className="pr-2">{props.endIcon}</div> : null}
        </button>
    )
}