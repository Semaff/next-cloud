import { ChangeEvent, FormEvent, useState } from "react";
import { passwordPattern } from "../../utils/RegExps";
import MyButton from "../Buttons/MyButton";
import MyInputWithLabel from "../Inputs/MyInputWithLabel";

interface PasswordFormProps {
    onSubmit: (...args: any[]) => void;
}

const ChangePasswordForm = ({ onSubmit }: PasswordFormProps) => {
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const canSubmitForm = password === checkPassword && passwordPattern.test(password);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(password);
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} className="form">
            <div className="form__body">
                <MyInputWithLabel
                    view="vertical"
                    placeholder="******"
                    name="password"
                    type="password"
                    title="Password must contain 6 characters with at least one number and one special character"
                    pattern={passwordPattern.source}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                >
                    New password:
                </MyInputWithLabel>

                <MyInputWithLabel
                    view="vertical"
                    placeholder="******"
                    name="check-password"
                    type="password"
                    title="Password must contain 6 characters with at least one number and one special character"
                    pattern={passwordPattern.source}
                    value={checkPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckPassword(e.target.value)}
                >
                    Check new password:
                </MyInputWithLabel>
            </div>

            <div className="form__footer">
                <MyButton type="submit" disabled={!canSubmitForm} className="--filled">
                    Change password
                </MyButton>
            </div>
        </form>
    )
}

export default ChangePasswordForm;