import { FormEvent, useState } from "react";
import NameForm, { NameFormProps } from "./NameForm";
import MyButton from "../Buttons/MyButton";

interface NameFormWithButtonProps extends NameFormProps {
    btnText: string;
}

const NameFormWithButton = ({ btnText, labelText, style, onSubmit }: NameFormWithButtonProps) => {
    const [name, setName] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(name);
        setName("");
    }

    return (
        <NameForm labelText={labelText} onSubmit={handleSubmit} style={style}>
            <div className="form__footer">
                <MyButton className="--filled" type="submit">
                    {btnText}
                </MyButton>
            </div>
        </NameForm>
    )
}

export default NameFormWithButton;