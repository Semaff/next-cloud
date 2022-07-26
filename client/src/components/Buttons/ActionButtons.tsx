import MyButton from "./MyButton";
import { memo } from "react";
import { TFile } from "../../types/TFile";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useRouter } from "next/router";
import { ArrowLeft, DeleteSVG, DownloadSVG, FolderSVG } from "../_SVG";
import { request } from "../../api/requests";
import { deleteFile } from "../../store/slices/files/actions";

interface ActionButtonsProps {
  setSelectedFiles: (files: TFile[]) => void;
  setIsModalVisible: (isVisible: boolean) => void;
  selectedFiles: TFile[];
}

const ActionButtons = memo(({ selectedFiles, setSelectedFiles, setIsModalVisible }: ActionButtonsProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const downloadSelectedFiles = async () => {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const response = await request.get("api/files/downloadFile/" + file.id);
      if (response.status === 200) {
        const blob = new Blob([await response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }

    setSelectedFiles([]);
  }

  const deleteSelectedFiles = () => {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      dispatch(deleteFile({ file }));
    }

    setSelectedFiles([]);
  }

  return (
    <div className="btn-wrapper">
      <MyButton onClick={() => setIsModalVisible(true)} className="--nofill --diagonal">
        <FolderSVG /> New Folder
      </MyButton>

      <MyButton
        onClick={downloadSelectedFiles}
        className="--nofill --diagonal"
        disabled={selectedFiles.length === 0}
      >
        <DownloadSVG /> Download
      </MyButton>

      <MyButton
        onClick={deleteSelectedFiles}
        className="--nofill --diagonal"
        disabled={selectedFiles.length === 0}
      >
        <DeleteSVG /> Delete
      </MyButton>
    </div>
  )
});

export default ActionButtons;