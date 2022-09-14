import { ReactNode } from "react";

export interface MyButtonProps {
    children: ReactNode | string;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    name?: string;
    onClick?: (...args: any[]) => void;
}

const MyButton = (props: MyButtonProps) => {
    const buttonStyles = ["btn", props.className];

    return (
        <button
            onClick={props.onClick}
            type={props.type || "button"}
            disabled={props.disabled}
            className={buttonStyles.join(" ")}
            name={props.name}
        >
            {props.children}
        </button>
    )
}

export default MyButton;