import styles from "../../styles/blocks/Profile.module.scss"
import { useState } from "react";
import { TUser } from "../../types/TUser";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { changePassword, logout } from "../../store/slices/auth/authSlice";
import MyButton from "../Buttons/MyButton";
import MiniModal from "../Modal/MiniModal";
import ChangePasswordForm from "../Forms/ChangePasswordForm";

interface ProfileProps {
    user: TUser | null;
}

const Profile = ({ user }: ProfileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const handleChangePassword = (newPassword: string) => {
        dispatch(changePassword({ newPassword, userId: user!.id }))
    }

    return (
        <div className={styles.profile}>
            <MyButton className="--filled" onClick={() => setIsOpen(prev => !prev)}>
                {user?.firstname} {user?.lastname}
                <span className="arrow" />
            </MyButton>

            <MiniModal isVisible={isOpen} style={{ maxWidth: "40rem", right: "0", top: "120%" }}>
                <ChangePasswordForm onSubmit={handleChangePassword} />

                <div className={styles.profile__logout}>
                    <MyButton className={`--nofill --font-small`} onClick={() => dispatch(logout())}>
                        Logout
                    </MyButton>
                </div>
            </MiniModal>
        </div>
    )
}

export default Profile;