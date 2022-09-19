import styles from "./File.module.scss";
import formatSize from "../../utils/formatSize";
import { TFile } from "../../types/TFile";
import { useRouter } from "next/router";
import { MouseEvent, MutableRefObject } from "react";
import { cutLongWord } from "../../utils/cutLongWord";
import { Share } from "../_SVG";
import { Anchor } from "../../types/Anchor";
import { getElementCoordinates } from "../../utils/getElementProperties";
import { ERoutes } from "../../types/ERoutes";

export interface FileProps {
    file: TFile;
    fileGridRef: MutableRefObject<null | HTMLElement>;
    files: TFile[];

    selectedFiles: TFile[];
    setSelectedFiles: (files: TFile[]) => void;

    setAnchor: (anchor: Anchor | ((prev: Anchor) => Anchor)) => void;
    setIsContextMenuOpen: (isContextMenuOpen: boolean | ((prev: boolean) => boolean)) => void;

    onMouseDown?: (e: MouseEvent<HTMLElement>, file: TFile) => void;
    onMouseUp?: (e: MouseEvent<HTMLElement>, file?: TFile) => void;
}

const File = ({ file, fileGridRef, files, selectedFiles, setSelectedFiles, setAnchor, setIsContextMenuOpen, onMouseDown, onMouseUp }: FileProps) => {
    const isSelected = selectedFiles.find(fileEl => fileEl.id === file.id);
    const isImage = file.type === "image";
    const isDir = file.type === "dir";
    const router = useRouter();

    /* Mouse Events */
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsContextMenuOpen(false);
        if (!e.ctrlKey && !e.shiftKey) {
            return setSelectedFiles([file]);
        }

        if (e.shiftKey) {
            const startPoint = files.indexOf(selectedFiles[0]) || 0;
            const endPoint = files.indexOf(file) || 0;

            const isGreater = startPoint < endPoint;
            const newSelectedFiles: TFile[] = [];
            if (isGreater) {
                for (let i = startPoint; i <= endPoint; i++) {
                    newSelectedFiles.push(files[i]);
                }
            } else {
                for (let i = endPoint; i <= startPoint; i++) {
                    newSelectedFiles.push(files[i]);
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

    const handleDoubleClick = () => {
        if (file.type === "dir" && !ERoutes.includes(router.route.slice(1).toLowerCase())) {
            setSelectedFiles([]);
            const parsedPath = router.asPath.slice(1);
            router.push(parsedPath + "/" + file.name);
        }
    }

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>, file: TFile) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFiles([file]);

        if (!fileGridRef.current) {
            return;
        }

        const { offsetX, offsetY } = getElementCoordinates(fileGridRef.current);
        setIsContextMenuOpen(false);
        const newPosition = {
            x: e.pageX - offsetX,
            y: e.pageY - offsetY,
        };

        setAnchor(newPosition);
        setIsContextMenuOpen(true);
    }

    return (
        <div
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={e => handleContextMenu(e, file)}

            onMouseDown={onMouseDown ? (e) => onMouseDown(e, file) : () => ({})}
            onMouseUp={onMouseUp ? (e) => onMouseUp(e, file) : () => ({})}

            className={`${styles.file} ${isSelected ? styles.selected : ""}`}
            title={file.name}
            unselectable="on"
        >
            <img
                className={styles.file__image}
                width={70}
                height={80}
                src={isImage
                    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/${file.path}`
                    : isDir ? "/folder.png" : "/file.png"
                }
                alt="file"
            />

            {file.accessLink && (
                <div className={styles.file__share}>
                    <Share />
                </div>
            )}

            <span className={styles.file__name}>{cutLongWord(file.name)}</span>
            <span className={styles.file__size}>{formatSize(file.size)}</span>
        </div>
    )
}

export default File;