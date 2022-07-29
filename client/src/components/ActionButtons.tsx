import { AxiosError } from "axios";
import { authRequest } from "../api/requests";
import { TFile } from "../types/TFile";
import DeleteSVG from "./SVG/DeleteSVG";
import DownloadSVG from "./SVG/DownloadSVG";

interface ActionButtonsProps {
    selectedFiles: TFile[];
    setFiles: (files: TFile[]) => void;
    setSelectedFiles: (files: TFile[]) => void;
    setNotifyText: (text: string) => void;
    setNotifyError: (err: string) => void;
}

const ActionButtons = ({ selectedFiles, setFiles, setSelectedFiles, setNotifyText, setNotifyError }: ActionButtonsProps) => {
    const btnStyles = ["upload-file"];
    if (selectedFiles.length > 0) {
        btnStyles.push("available");
    }

    const downloadFiles = () => {
        let timeout = 100;
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            setTimeout(() => {
                const link = document.createElement("a");
                link.setAttribute("download", file.name);
                link.href = "http://localhost:5000/db/" + file.path;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }, timeout)
            timeout += 100;
        }
    }

    const deleteFiles = async () => {
        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                await authRequest.delete("api/file/delete/" + file.id)
            }
            const response = await authRequest.get("api/file/getall");
            setNotifyText("Files deleted!");
            setFiles(response.data);
            setSelectedFiles([]);
        } catch (err: AxiosError | any) {
            setNotifyError("Error: " + err.response.data.message);
        }
    }

    return (
        <div className="gap">
            <button onClick={downloadFiles} type="button" className={btnStyles.join(" ")}>
                <DownloadSVG /> Download
            </button>

            <button onClick={deleteFiles} type="button" className={btnStyles.join(" ")}>
                <DeleteSVG /> Delete
            </button>
        </div>
    )
}

export default ActionButtons;