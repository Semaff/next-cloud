import { ESorts } from "../types/ESorts";
import { TFile } from "../types/TFile";
import File from "./File";
import styles from "../styles/blocks/File.module.scss";

interface FileGridProps {
    sort: ESorts;
    files: TFile[];
    selectFile: (file: TFile) => void;
    selectedFiles: TFile[];
}

const FileGrid = ({ sort, files, selectFile, selectedFiles }: FileGridProps) => {
    let sortedFiles;
    if(sort === ESorts.NAME) {
        sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === ESorts.SIZE) {
        sortedFiles = files.sort((a, b) => b.size - a.size);
    } else {
        sortedFiles = files.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    return (
        <section className={styles.file__grid}>
            <div className={styles.file__grid_inner}>
                {sortedFiles.map(file => (
                    <File
                        key={file.id}
                        file={file}
                        selectFile={selectFile}
                        selectedFiles={selectedFiles}
                    />
                ))}
            </div>
        </section>
    )
}

export default FileGrid;