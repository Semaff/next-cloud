import { FormEvent, useState } from "react";
import { TUser } from "../types/TUser";
import styles from "../styles/blocks/Profile.module.scss"

interface ProfileProps {
    user: TUser | null;
    handleLogout: () => void;
    handleChangePassword: (password: string) => void;
}

const Profile = ({ user, handleLogout, handleChangePassword }: ProfileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [againPassword, setAgainPassword] = useState("");

    const canSubmit = password.length > 3 && againPassword.length > 3 && password === againPassword;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPassword("");
        setAgainPassword("");
        handleChangePassword(password);
    }

    return (
        <div className={styles.profile}>
            <button type="button" className={styles.profile__header} onClick={() => setIsOpen(prev => !prev)}>
                <h3 className={styles.profile__name}>{user?.username}</h3>
                <span className="arrow" />
            </button>

            <div className={[styles.profile__modal, `${isOpen ? styles.visible : ""}`].join(" ")}>
                <form onSubmit={(e) => onSubmit(e)} className="form">
                    <div className="input-placeholder">
                        <label className="label  --small" htmlFor="password">New password: </label>
                        <input
                            type="password"
                            className="input --small"
                            placeholder="******"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-placeholder">
                        <label className="label  --small" htmlFor="repeat-password">Password again: </label>
                        <input
                            type="password"
                            className="input --small"
                            placeholder="******"
                            id="repeat-password"
                            value={againPassword}
                            onChange={e => setAgainPassword(e.target.value)}
                        />
                    </div>
                    <button disabled={!canSubmit} className="btn  --left --small --filled">
                        Change password
                    </button>
                </form>

                <h5 className={styles.logout} onClick={() => handleLogout()}>
                    Logout
                </h5>
            </div>
        </div>
    )
}

export default Profile;