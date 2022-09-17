import styles from "./Profile.module.scss"
import MyButton from "../Buttons/MyButton";
import MiniModal from "../Modal/MiniModal";
import ChangePasswordForm from "../Forms/ChangePasswordForm";
import { useState } from "react";
import { TUser } from "../../types/TUser";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useRouter } from "next/router";
import { changePassword, logout } from "../../store/slices/auth/actions";

interface ProfileProps {
    user: TUser | null;
}

const Profile = ({ user }: ProfileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleChangePassword = (newPassword: string) => {
        dispatch(changePassword({ newPassword }))
    }

    const handleLogout = () => {
        dispatch(logout());
        router.push("/signin");
    }

    return (
        <div className={styles.profile}>
            <MyButton className="--filled" onClick={() => setIsOpen(prev => !prev)}>
                {user?.firstname} {user?.lastname}
                <span className="arrow" />
            </MyButton>

            <MiniModal isVisible={isOpen} style={{ minWidth: "28rem", maxWidth: "40rem", right: "0", top: "120%" }}>
                <ChangePasswordForm onSubmit={handleChangePassword} />

                <div className={styles.profile__logout}>
                    <MyButton className={`--nofill --font-small`} onClick={handleLogout}>
                        Logout
                    </MyButton>
                </div>
            </MiniModal>
        </div>
    )
}

export default Profile;