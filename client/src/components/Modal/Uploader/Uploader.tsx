import styles from "./Uploader.module.scss";
import MiniModal from "../MiniModal";
import UploaderFile from "./UploaderFile";
import { useSelector } from "react-redux";
import { selectUploaderIsVisible, selectUploadFiles, setUploaderIsVisible } from "../../../store/slices/uploader/uploaderSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import MyButton from "../../Buttons/MyButton";
import { useEffect } from "react";

const Uploader = () => {
  const isUploaderVisible = useSelector(selectUploaderIsVisible);
  const uploadFiles = useSelector(selectUploadFiles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (uploadFiles.length === 0 && isUploaderVisible !== false) {
      dispatch(setUploaderIsVisible(false));
    }
  }, [uploadFiles])

  return (
    <MiniModal
      isVisible={isUploaderVisible}
      style={{
        bottom: 0,
        right: "5%",
        maxWidth: "35rem",
      }}>
      <div className={styles.uploader}>
        <div className={styles.uploader__header}>
          <h2 className={styles.uploader__title}>Downloads</h2>
          <MyButton className="--filled" onClick={() => dispatch(setUploaderIsVisible(false))}>
            X
          </MyButton>
        </div>

        {uploadFiles.map(file =>
          <UploaderFile key={file.id} file={file} />
        )}
      </div>
    </MiniModal>
  )
}

export default Uploader;