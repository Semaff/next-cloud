import styles from "./Uploader.module.scss";
import MyButton from "../../Buttons/MyButton";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { removeUploadFile } from "../../../store/slices/uploader/uploaderSlice";
import { UploadFile } from "../../../types/UploadFile";

interface UploaderFileProps {
    file: UploadFile
}

const UploaderFile = ({ file }: UploaderFileProps) => {
    const dispatch = useAppDispatch();

    return (
        <div className={styles.uploader__file}>
            <div className={styles["uploader__file-header"]}>
                <h3 className={styles["uploader__file-name"]}>
                    {file.name} ({file.progress}%)
                </h3>

                <MyButton className="--nofill" onClick={() => dispatch(removeUploadFile(file.id))}>
                    X
                </MyButton>
            </div>
        </div>
    )
}

export default UploaderFile;