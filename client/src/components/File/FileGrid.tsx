import styles from "../../styles/blocks/File.module.scss";
import File from "./File";
import { TFile } from "../../types/TFile";
import { ESorts } from "../../types/ESorts";
import { DragEvent, MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { sortByCurrentSortName } from "../../utils/sortByCurrentSortName";
import { uploadFile } from "../../store/slices/files/actions";

interface FileGridProps {
    files: TFile[] | null;
    curSort: ESorts;
    selectedFiles: TFile[];
    setSelectedFiles: (files: TFile[]) => void;
    handleShowContextMenu: (e: MouseEvent<HTMLDivElement>, file: TFile) => void;
    setIsContextMenuOpen: (isOpen: boolean) => void;
    onMouseDown?: (e: MouseEvent<HTMLElement>, file: TFile) => void;
    onMouseUp?: (e: MouseEvent<HTMLElement>, file?: TFile) => void;
    onMouseMove?: (e: MouseEvent<HTMLElement>) => void;
}

const FileGrid = (props: FileGridProps) => {
    const {
        curSort,
        files,
        handleShowContextMenu,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        selectedFiles,
        setIsContextMenuOpen,
        setSelectedFiles
    } = props

    const [dragEnter, setDragEnter] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    let orderedFiles: TFile[] | undefined;
    if (files) {
        orderedFiles = [...files]
            .sort((a, b) => sortByCurrentSortName(a, b, curSort))
            .sort((a, b) => a.type === "dir" ? b.type === "dir" ? 0 : -1 : 1);
    }

    const handleFileClick = (e: MouseEvent<HTMLDivElement>, file: TFile) => {
        const isSelected = selectedFiles.find(fileEl => fileEl.id === file.id);
        setIsContextMenuOpen(false);
        if (!e.ctrlKey && !e.shiftKey) {
            return setSelectedFiles([file]);
        }

        if (e.shiftKey) {
            const startPoint = orderedFiles?.indexOf(selectedFiles[0]) || 0;
            const endPoint = orderedFiles?.indexOf(file) || 0;
            const newStartPoint = startPoint < endPoint ? startPoint : endPoint;
            const newEndPoint = startPoint < endPoint ? endPoint : startPoint;
            const newSelectedFiles: TFile[] = [];
            for (let i = newStartPoint; i <= newEndPoint; i++) {
                if (orderedFiles?.[i]) {
                    newSelectedFiles.push(orderedFiles[i]);
                }
            }
            return setSelectedFiles(newSelectedFiles);
        }

        if (isSelected) {
            setSelectedFiles([...selectedFiles.filter(fileEl => fileEl.id !== file.id)]);
        } else {
            setSelectedFiles([...selectedFiles, file]);
        }
    }

    function dragEnterHandler(e: DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragEnter(true);
    }

    function dragLeaveHandler(e: DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragEnter(false);
    }

    function dropHandler(e: DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        const files = [...Array.from(e.dataTransfer.files)];
        files.forEach(file => dispatch(uploadFile({ file, path: router.asPath })));
        setDragEnter(false);
    }

    return (
        <section className={styles.file__drag} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
            {!dragEnter
                ?
                <section
                    className={styles.file__grid}
                    onClick={() => setSelectedFiles([])}
                    onDragEnter={dragEnterHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragEnterHandler}
                >
                    {orderedFiles?.map((file) => (
                        <File
                            key={file.id}
                            file={file}
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            handleShowContextMenu={handleShowContextMenu}
                            handleFileClick={handleFileClick}
                            onMouseDown={onMouseDown}
                            onMouseUp={onMouseUp}
                        />
                    ))}
                </section>
                :
                <div
                    onDragEnter={dragEnterHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragEnterHandler}
                    onDrop={dropHandler}
                    className={styles["file__drop"]}
                    style={{ display: dragEnter ? "flex" : "none" }}
                >
                    Drop your files there
                </div>
            }
        </section>
    )
}

export default FileGrid;