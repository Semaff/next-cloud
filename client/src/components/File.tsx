import { TFile } from "../types/TFile";
import DownloadSVG from "./SVG/DownloadSVG";
import styles from "../styles/blocks/File.module.scss";
import FileService from "../services/FileService";

interface FileProps {
    file: TFile;
    selectFile: (file: TFile) => void;
    selectedFiles: TFile[]
}

const File = ({ file, selectFile, selectedFiles }: FileProps) => {
    const downloadFile = () => {
        FileService.downloadFile(file);
    }

    const fileStyles = [styles.file];
    if (selectedFiles.find(fileEl => fileEl.id === file.id)) {
        fileStyles.push(styles.active);
    }

    return (
        <div className={fileStyles.join(" ")} onClick={() => selectFile(file)}>
            <div className={styles.file__image}>
                <img
                    width={100}
                    height={100}
                    src={`http://localhost:5000/db/${file.cover}`}
                    alt="1"
                />

                <div className={styles.file__overlay}>
                    <button type="button" onClick={downloadFile}>
                        <DownloadSVG />
                    </button>
                </div>
            </div>

            <h4 className={styles.file__name}>{file.name}.{file.ext}</h4>
            <h5 className={styles.file__size}>{(file.size / 1024 / 1024 / 8).toFixed(3) + " Mb"}</h5>
        </div>
    )
}

export default File;