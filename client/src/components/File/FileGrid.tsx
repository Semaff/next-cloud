import styles from "./File.module.scss";
import File from "./File";
import { DragEvent, MouseEvent, useRef, useState } from "react";
import { TFile } from "../../types/TFile";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import FileMirage from "./FileMirage";
import { ESorts } from "../../types/ESorts";
import ContextMenu from "../Modal/ContextMenu/ContextMenu";
import { moveFile } from "../../store/slices/files/actions";
import { getElementCoordinates } from "../../utils/getElementProperties/getElementProperties";
import { ERoutes } from "../../types/ERoutes";
import { useRouter } from "next/router";

/*
  Helper Functions
  =================
*/
function sortFiles(files: TFile[], sort: ESorts) {
  const orderedFiles: TFile[] = [...files].sort((a, b) => sortBySortName(a, b, sort));
  return orderedFiles.sort((a, b) => a.type === "dir" ? b.type === "dir" ? 0 : -1 : 1);
}

function sortBySortName(a: TFile, b: TFile, sort: ESorts) {
  if (a.name === "..") {
    return -1;
  }

  if (b.name === "..") {
    return 1;
  }

  if (sort === ESorts.NAME) {
    return a.name.localeCompare(b.name)
  } else if (sort === ESorts.SIZE) {
    return a.size > b.size ? -1 : 1;
  } else {
    return new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1
  }
}

/*
  File Grid component
  ======================
*/
interface FileGridProps {
  files: TFile[],
  currentSort: ESorts,
  selectedFiles: TFile[],
  setSelectedFiles: (files: TFile[] | ((prev: TFile[]) => TFile[])) => void;
  setIsRenameModalVisible: (isVisible: boolean) => void;
  onDragEnter?: (e: DragEvent<HTMLElement>) => void;
}

const FileGrid = ({ files, currentSort, selectedFiles, setSelectedFiles, setIsRenameModalVisible, onDragEnter }: FileGridProps) => {
  const router = useRouter();
  const orderedFiles = sortFiles(files, currentSort);
  const fileGridRef = useRef(null);
  const dispatch = useAppDispatch();

  /* Mirage File state */
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mirageAnchor, setMirageAnchor] = useState({ x: 0, y: 0 });

  /* Context Menu state */
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    setSelectedFiles([]);
    setIsContextMenuOpen(false);
  }

  const handleMouseDown = (e: MouseEvent<HTMLElement>, file: TFile) => {
    if (file.name === "..") {
      return;
    }

    if (selectedFiles.length <= 1 && !e.ctrlKey && !e.shiftKey) {
      setSelectedFiles([file]);
    }

    if (!fileGridRef.current || ERoutes.includes(router.route.slice(1).toLowerCase())) {
      return;
    }

    const { offsetX, offsetY } = getElementCoordinates(fileGridRef.current);
    setIsMouseDown(true);
    const newPosition = {
      x: e.pageX - offsetX,
      y: e.pageY - offsetY,
    };

    setMirageAnchor(newPosition);
  }

  const handleMouseUp = (e: MouseEvent<HTMLElement>, file?: TFile) => {
    setIsMouseDown(false);
    setIsDragging(false);

    if (!file || file.type !== "dir" || selectedFiles.find(fileEl => fileEl.id === file.id)) {
      return;
    }

    if (isDragging) {
      const parentId = file.id;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        dispatch(moveFile({ fileId: file.id, parentId }))
      }
    }
  }

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!fileGridRef.current) {
      return;
    }

    const { offsetX, offsetY } = getElementCoordinates(fileGridRef.current);
    const dx = Math.abs(e.pageX - offsetX - mirageAnchor.x) >= 20;
    const dy = Math.abs(e.pageY - offsetY - mirageAnchor.y) >= 20;

    if ((isMouseDown && (dx || dy)) || isDragging) {
      setIsDragging(true);
      const newPosition = {
        x: e.pageX - offsetX,
        y: e.pageY - offsetY,
      };

      setMirageAnchor(newPosition);
    }
  }

  return (
    <div
      ref={fileGridRef}
      className={styles["file__grid-inner"]}
      onClick={handleClick}
      onDragEnter={onDragEnter}
      onDragOver={onDragEnter}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <FileMirage
        coords={mirageAnchor}
        isVisible={isMouseDown && isDragging}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      <ContextMenu
        coords={anchor}
        isVisible={isContextMenuOpen}
        selectedFiles={selectedFiles}
        setIsContextMenuOpen={setIsContextMenuOpen}
        setIsRenameModalVisible={setIsRenameModalVisible}
      />

      {orderedFiles.map((file) => (
        <File
          key={file.id}
          file={file}
          fileGridRef={fileGridRef}
          files={orderedFiles}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setAnchor={setAnchor}
          setIsContextMenuOpen={setIsContextMenuOpen}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      ))}
    </div>
  )
}

export default FileGrid;