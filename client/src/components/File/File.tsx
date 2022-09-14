import { TFile } from "../../types/TFile";
import styles from "../../styles/blocks/File.module.scss";
import formatSize from "../../utils/formatSize";
import Image from "next/image";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { cutLongWord } from "../../utils/cutLongWord";
import Share from "../_SVG/Share";

export interface FileProps {
    file: TFile;
    selectedFiles: TFile[];
    setSelectedFiles: (files: TFile[]) => void;
    handleShowContextMenu: (e: MouseEvent<HTMLDivElement>, file: TFile) => void;
    handleFileClick: (e: MouseEvent<HTMLDivElement>, file: TFile) => void;
    onMouseDown?: (e: MouseEvent<HTMLElement>, file: TFile) => void;
    onMouseUp?: (e: MouseEvent<HTMLElement>, file?: TFile) => void;
}

const File = (props: FileProps) => {
    const {
        file,
        handleFileClick,
        handleShowContextMenu,
        onMouseDown,
        onMouseUp,
        selectedFiles,
        setSelectedFiles
    } = props;

    const isSelected = selectedFiles.find(fileEl => fileEl.id === file.id);
    const router = useRouter();

    const handleOpenFolder = () => {
        if (file.type === "dir") {
            setSelectedFiles([]);
            const parsedPath = router.asPath.slice(1);
            router.push(parsedPath + "/" + file.name);
        }
    }

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        handleFileClick(e, file);
    }

    return (
        <>
            <div
                className={`${styles.file} ${isSelected ? styles.selected : ""}`}
                onClick={handleClick}
                onMouseDown={onMouseDown ? (e) => onMouseDown(e, file) : () => ({})}
                onMouseUp={onMouseUp ? (e) => onMouseUp(e, file) : () => ({})}
                onDoubleClick={handleOpenFolder}
                onContextMenu={e => handleShowContextMenu(e, file)}
                title={file.name}
                unselectable="on"
            >
                {file.type === "image"
                    ?
                    <img
                        className={styles.file__image}
                        width={70}
                        height={80}
                        src={`http://localhost:5000/${file.path}`}
                        alt={file.name}
                    />
                    :
                    <Image
                        className={styles.file__image}
                        width={70}
                        height={80}
                        src={file.type === "dir" ? "/folder.png" : "/file.png"}
                        alt={file.name}
                    />
                }

                {file.accessLink
                    ? (
                        <div className={styles.file__share}>
                            <Share />
                        </div>
                    )
                    : null
                }

                <span className={styles.file__name}>{cutLongWord(file.name)}</span>
                <span className={styles.file__size}>{formatSize(file.size)}</span>
            </div>
        </>
    )
}

export default File;