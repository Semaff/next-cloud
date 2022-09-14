import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { selectUser } from "../../store/slices/auth/authSlice";
import { uploadFile } from "../../store/slices/files/actions";
import styles from "../../styles/blocks/LeftBar.module.scss";
import formatSize from "../../utils/formatSize";
import MyUpload from "../Inputs/MyUpload";
import ProgressBar from "../ProgressBar/ProgressBar";
import LeftBarLink from "./LeftBarLink";

const LeftBar = () => {
    const dispatch = useAppDispatch();
    const user = useTypedSelector(selectUser);
    const router = useRouter();

    const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        if (!files) {
            return;
        }

        for (let i = 0; i < files?.length; i++) {
            const file = files[i];
            dispatch(uploadFile({ path: router.asPath, file: file }));
        }
    }

    return (
        <div className={styles.leftbar}>
            <div className={styles.leftbar__logo}>
                <Image
                    style={{ cursor: "pointer" }}
                    width={35}
                    height={35}
                    src="/logo.png"
                    alt="file"
                    onClick={() => router.push("/")}
                />
            </div>

            <ul className={styles.leftbar__list}>
                <MyUpload
                    multiple
                    name="upload"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleUploadFile(e)}
                >
                    Upload File
                </MyUpload>

                <LeftBarLink path="/" img="/fileIcon.png">
                    Files
                </LeftBarLink>

                <LeftBarLink path="/shared" img="/shared.png">
                    Shared Files
                </LeftBarLink>

                <LeftBarLink path="/profile" img="/profile.png">
                    Profile
                </LeftBarLink>
            </ul>

            <div className={styles.leftbar__footer}>
                <span>Free: {formatSize((user?.diskSpace || 0) - (user?.usedSpace || 1))} </span>
                <span>of {formatSize(user?.diskSpace || 0)}</span>
                <ProgressBar progress={Math.ceil((user?.usedSpace || 0) / (user?.diskSpace || 1) * 100)} />
            </div>
        </div>
    )
}

export default LeftBar;