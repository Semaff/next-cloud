import { MouseEvent } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { deleteFile, removeShareFile, shareFile } from "../../../store/slices/files/actions";
import { Anchor } from "../../../types/Anchor";
import { TFile } from "../../../types/TFile";
import MyButton from "../../Buttons/MyButton";
import MiniModal from "../MiniModal";

interface ContextMenuProps {
    coords: Anchor,
    isVisible: boolean,
    selectedFiles: TFile[],
    setIsContextMenuOpen: (isOpen: boolean) => void,
    setIsRenameModalVisible: (isVisible: boolean) => void
}

const ContextMenu = ({ coords, isVisible, selectedFiles, setIsContextMenuOpen, setIsRenameModalVisible }: ContextMenuProps) => {
    const file = selectedFiles[0];
    const dispatch = useAppDispatch();

    if (!file) {
        return null;
    }

    const handleRename = () => {
        setIsRenameModalVisible(true);
        setIsContextMenuOpen(false);
    }

    const handleDelete = () => {
        dispatch(deleteFile({ file }));
        setIsContextMenuOpen(false);
    }

    const handleShare = () => {
        dispatch(shareFile({ file }));
        setIsContextMenuOpen(false);
    }

    const handleRemoveShare = () => {
        dispatch(removeShareFile({ file }))
        setIsContextMenuOpen(false);
    }

    const handleAccessLinkCopy = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(e.currentTarget.getAttribute('href') || "").then(() => {
            setIsContextMenuOpen(false);
        });
    }

    return (
        <MiniModal isVisible={isVisible} style={{
            width: "unset",
            maxWidth: "40rem",
            display: "flex",
            flexDirection: "column",
            top: coords.y,
            left: coords.x
        }}>
            <div className="flex flex-dir-column gap5">
                <MyButton onClick={() => handleRename()}>
                    Rename
                </MyButton>

                <MyButton onClick={() => handleDelete()}>
                    Delete
                </MyButton>

                {/* If file isn't a folder and have an access link */}
                {file.type !== "dir" && file.accessLink && (
                    <>
                        <MyButton onClick={() => handleRemoveShare()}>
                            Remove Share
                        </MyButton>
                        <a href={`http://localhost:3000/shared/${file.accessLink}`}
                            onClick={handleAccessLinkCopy}
                            className={`btn --filled`}
                        >
                            Copy Access Link
                        </a>
                    </>
                )}

                {/* If file isn't a folder and doesn't have an access link */}
                {file.type !== "dir" && !file.accessLink && (
                    <MyButton onClick={() => handleShare()}>
                        Share
                    </MyButton>
                )}
            </div>
        </MiniModal>
    )
}

export default ContextMenu;