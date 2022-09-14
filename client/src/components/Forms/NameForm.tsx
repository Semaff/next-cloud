import { ChangeEvent, FormEvent, useState } from "react";
import MyButton from "../Buttons/MyButton";
import MyInputWithLabel from "../Inputs/MyInputWithLabel";

interface CreateFolderFormProps {
    btnText: string;
    labelText: string;
    onSubmit: (...args: any[]) => void;
}

const NameForm = ({ btnText, labelText, onSubmit }: CreateFolderFormProps) => {
    const [name, setName] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(name);
        setName("");
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form__body">
                <MyInputWithLabel
                    view="vertical"
                    name={labelText}
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                >
                    {labelText}
                </MyInputWithLabel>
            </div>

            <div className="form__footer">
                <MyButton className="--filled" type="submit">
                    {btnText}
                </MyButton>
            </div>
        </form>
    )
}

export default NameForm;