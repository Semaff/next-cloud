import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { authRequest } from "../api/requests";
import FileService from "../services/FileService";
import FolderService from "../services/FolderService";
import { TFile } from "../types/TFile";
import { encodePath } from "../utils/encodePath";
import DeleteSVG from "./SVG/DeleteSVG";
import DownloadSVG from "./SVG/DownloadSVG";
import FolderSVG from "./SVG/FolderSVG";

interface ActionButtonsProps {
    selectedFiles: TFile[];
    setFiles: (files: TFile[]) => void;
    setSelectedFiles: (files: TFile[]) => void;
    setNotifyText: (text: string) => void;
    setNotifyError: (err: string) => void;
}

const ActionButtons = ({ selectedFiles, setFiles, setSelectedFiles, setNotifyText, setNotifyError }: ActionButtonsProps) => {
    const router = useRouter();
    const btnStyles = ["upload-file"];
    if (selectedFiles.length > 0) btnStyles.push("available");

    const downloadFiles = () => {
        FileService.downloadFiles(selectedFiles);
    }

    const deleteFiles = async () => {
        try {
            await FileService.deleteFiles(selectedFiles);
            setNotifyText("Files deleted!");

            const updatedFiles = await FileService.getAllFiles();
            setFiles(updatedFiles);
            setSelectedFiles([]);
        } catch (err: AxiosError | any) {
            setNotifyError("Error: " + err.response.data.message);
        }
    }

    const createFolder = async () => {
        try {
            const path = encodePath(router.pathname);
            await FolderService.createFolder(path, "Folder");
            const folders = await FolderService.getAllFolders(path);
            setNotifyText("Folder created!");
        } catch (err: AxiosError | any) {
            setNotifyError("Error: " + err.response.data.message);
        }
    }

    return (
        <div className="gap">
            <button
                onClick={createFolder}
                type="button"
                className={["upload-file", "available"].join(" ")}
            >
                <FolderSVG /> New Folder
            </button>

            <button
                onClick={downloadFiles}
                type="button"
                className={btnStyles.join(" ")}
                disabled={selectedFiles.length === 0}
            >
                <DownloadSVG /> Download
            </button>

            <button
                onClick={deleteFiles}
                type="button"
                className={btnStyles.join(" ")}
                disabled={selectedFiles.length === 0}
            >
                <DeleteSVG /> Delete
            </button>
        </div>
    )
}

export default ActionButtons;