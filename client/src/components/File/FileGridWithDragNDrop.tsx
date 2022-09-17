import styles from "./File.module.scss";
import FileGrid from "./FileGrid";
import { ESorts } from "../../types/ESorts";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { DragEvent, useState } from "react";
import { TFile } from "../../types/TFile";
import { uploadFile } from "../../store/slices/files/actions";

interface FileGridWithDragNDropProps {
    files: TFile[];
    currentSort: ESorts;
    selectedFiles: TFile[];
    setSelectedFiles: (files: TFile[] | ((prev: TFile[]) => TFile[])) => void;
    setIsRenameModalVisible: (isVisible: boolean) => void;
}

const FileGridWithDragNDrop = ({ files, currentSort, selectedFiles, setSelectedFiles, setIsRenameModalVisible }: FileGridWithDragNDropProps) => {
    const [dragEnter, setDragEnter] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    function handleDragEnter(e: DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragEnter(true);
    }

    function handleDragLeave(e: DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragEnter(false);
    }

    function handleDrop(e: DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        const files = [...Array.from(e.dataTransfer.files)];
        files.forEach(file => dispatch(uploadFile({ file, path: router.asPath })));
        setDragEnter(false);
    }

    return (
        <section className={styles.file__grid}>
            {dragEnter && (
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragEnter}
                    onDrop={handleDrop}
                    className={styles["file__drop"]}
                    style={{
                        display: dragEnter ? "flex" : "none"
                    }}>
                    Drop your files there
                </div>
            )}

            <FileGrid
                currentSort={currentSort}
                selectedFiles={selectedFiles}
                files={files}
                setSelectedFiles={setSelectedFiles}
                setIsRenameModalVisible={setIsRenameModalVisible}
                onDragEnter={handleDragEnter}
            />
        </section>

    )
}

export default FileGridWithDragNDrop;