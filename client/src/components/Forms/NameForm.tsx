import { ChangeEvent, CSSProperties, FormEvent, ReactNode, useState } from "react";
import MyInputWithLabel from "../Inputs/MyInputWithLabel";

export interface NameFormProps {
    view?: "vertical" | "horizontal";
    children?: ReactNode | string;
    style?: CSSProperties;
    labelText: string;
    onSubmit: (...args: any[]) => void;
}

const NameForm = ({ view, children, labelText, style, onSubmit }: NameFormProps) => {
    const [name, setName] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(name);
        setName("");
    }

    return (
        <form className="form" onSubmit={handleSubmit} style={style}>
            <div className="form__body">
                <MyInputWithLabel
                    view={view || "vertical"}
                    name={labelText}
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                >
                    {labelText}
                </MyInputWithLabel>
            </div>

            {children}
        </form>
    )
}

export default NameForm;