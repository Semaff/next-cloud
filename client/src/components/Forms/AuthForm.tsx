import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { emailPattern, passwordPattern } from "../../utils/regExps/regExps";
import MyInputWithLabel from "../Inputs/MyInputWithLabel";

export interface FormProps {
    children?: ReactNode | string;
    canSubmit?: boolean;
    titleText: string;
    btnText: string;
    onSubmit: (...args: any[]) => void;
}

const AuthForm = ({ children, canSubmit, titleText, btnText, onSubmit }: FormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const canSubmitForm = (canSubmit ?? true) && emailPattern.test(email) && passwordPattern.test(password);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit(email, password);
    }

    return (
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form__header">
                <h2 className="form__title">{titleText || "Form"}</h2>
            </div>

            <div className="form__body">
                {children}

                <MyInputWithLabel
                    view="vertical"
                    placeholder="asd@mail.ru"
                    name="email"
                    type="email"
                    pattern={emailPattern.source}
                    title="Invalid email address"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                >
                    Email:
                </MyInputWithLabel>

                <MyInputWithLabel
                    view="vertical"
                    placeholder="******"
                    type="password"
                    name="password"
                    title="Password must contain 6 characters with at least one number and one special character"
                    pattern={passwordPattern.source}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                >
                    Password:
                </MyInputWithLabel>
            </div>

            <div className="form__footer">
                <button type="submit" className="btn --filled" disabled={!canSubmitForm}>
                    {btnText || "Submit"}
                </button>
            </div>
        </form>
    )
}

export default AuthForm;