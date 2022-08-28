import { ReactElement } from "react";

export interface MyLabelProps {
    children: ReactElement | string;
    name?: string;
    className?: string;
}

const MyLabel = (props: MyLabelProps) => {
    return (
        <label
            className={`label ${props.className || ""}`}
            htmlFor={props.name}
        >
            {props.children}
        </label>
    )
}

export default MyLabel;