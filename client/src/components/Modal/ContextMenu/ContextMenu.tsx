import { MouseEvent, useState } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { deleteFile, removeShareFile, renameFile, shareFile } from "../../../store/slices/files/actions";
import { TFile } from "../../../types/TFile";
import MyButton from "../../Buttons/MyButton";
import NameForm from "../../Forms/NameForm";
import MiniModal from "../MiniModal";
import Modal from "../Modal";

interface ContextMenuProps {
    isVisible: boolean,
    selectedFiles: TFile[],
    setIsContextMenuOpen: (isOpen: boolean) => void,
    coords: { x: number, y: number }
}

const ContextMenu = (props: ContextMenuProps) => {
    const {
        isVisible,
        selectedFiles,
        setIsContextMenuOpen,
        coords
    } = props;
    const file = selectedFiles[0];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useAppDispatch();

    const handleRename = () => {
        setIsModalVisible(true);
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

    const handleRenameFile = (name: string) => {
        dispatch(renameFile({ name, file }));
        setIsModalVisible(false);
    }

    const handleAccessLinkCopy = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(e.currentTarget.getAttribute('href') || "").then(() => {
            setIsContextMenuOpen(false);
        });
    }

    return (
        <>
            <Modal
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                style={{ width: "30rem", borderRadius: "3px" }}
            >
                <NameForm
                    onSubmit={handleRenameFile}
                    btnText="Rename file"
                    labelText="Enter new file's name"
                />
            </Modal>

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
                    {file?.type !== "dir" && file?.accessLink && (
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
                    {file?.type !== "dir" && !file?.accessLink && (
                        <MyButton onClick={() => handleShare()}>
                            Share
                        </MyButton>
                    )}
                </div>
            </MiniModal>
        </>
    )
}

export default ContextMenu;