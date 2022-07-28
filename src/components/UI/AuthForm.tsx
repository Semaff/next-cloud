import { FormEvent, useState } from "react";

interface AuthFormProps {
    handleSubmit: (username: string, password: string) => void;
    btnText?: string;
}

const AuthForm = ({ handleSubmit, btnText }: AuthFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const canSubmit = username.length > 3 && password.length > 3;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(username, password);
    }

    return (
        <form onSubmit={(e) => onSubmit(e)} className="form">
            <div className="input-placeholder">
                <label className="label" htmlFor="username">Username</label>
                <input
                    className="input"
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div className="input-placeholder">
                <label className="label" htmlFor="password">Password</label>
                <input
                    className="input"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button className="btn  --filled" disabled={!canSubmit}>
                {btnText || "Submit"}
            </button>
        </form>
    )
}

export default AuthForm;