import { ChangeEvent, useState } from "react";
import { onlyLettersPattern } from "../../utils/regExps/regExps";
import MyInputWithLabel from "../Inputs/MyInputWithLabel";
import AuthForm, { FormProps } from "./AuthForm";

const AuthFormWithNameFields = ({ children, canSubmit, titleText, btnText, onSubmit }: FormProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const canSubmitForm = (canSubmit ?? true) && onlyLettersPattern.test(firstName) && onlyLettersPattern.test(lastName);

    const handleSubmit = (email: string, password: string) => {
        onSubmit(firstName, lastName, email, password);
    }

    return (
        <AuthForm onSubmit={handleSubmit} canSubmit={canSubmitForm} btnText={btnText} titleText={titleText}>
            {children}

            <MyInputWithLabel
                view="vertical"
                placeholder="John"
                name="firstname"
                title="You must only use letters!"
                pattern={onlyLettersPattern.source}
                value={firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            >
                First name:
            </MyInputWithLabel>

            <MyInputWithLabel
                view="vertical"
                placeholder="Smith"
                name="lastname"
                title="You must only use letters!"
                pattern={onlyLettersPattern.source}
                value={lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            >
                Last name:
            </MyInputWithLabel>
        </AuthForm>
    )
}

export default AuthFormWithNameFields;