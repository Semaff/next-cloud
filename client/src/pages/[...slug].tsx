import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { ESorts } from "../types/ESorts";
import { TFile } from "../types/TFile";
import { ActionButtons, ControlButtons, FileGrid, LeftBar, Notifier, Profile } from "../components";
import useNotifierText from "../hooks/useNotifierText";
import MainLayout from "../layouts/MainLayout";
import styles from "../styles/pages/Home.module.scss";
import FileService from "../services/FileService";
import FolderService from "../services/FolderService";
import { TFolder } from "../types/TFolder";
import { encodePath } from "../utils/encodePath";
import FolderGrid from "../components/FolderGrid";

const Home = () => {
    const [files, setFiles] = useState<TFile[]>([]);
    const [folders, setFolders] = useState<TFolder[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const [sort, setSort] = useState(ESorts.NAME);
    const { isLoggedIn, authError, user, logout, changePassword } = useAuth();
    const notifyError = useNotifierText("");
    const notifyText = useNotifierText("");
    const router = useRouter();

    const handleLogout = () => {
        logout();
    }

    const handleChangePassword = (password: string) => {
        changePassword(password);
        if (!authError) {
            notifyText.setValue("Password has changed!");
        }
    }

    const selectFile = (file: TFile) => {
        const possibleFile = selectedFiles.find(fileEl => fileEl.id === file.id);
        if (possibleFile) {
            setSelectedFiles(selectedFiles.filter(fileEl => fileEl.id !== file.id));
        } else {
            const newSelectedFiles = [...selectedFiles];
            newSelectedFiles.push(file);
            setSelectedFiles(newSelectedFiles);
        }
    }

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/signin");
        }

        const getFiles = async () => {
            try {
                const path = encodePath(router.pathname);
                const files = await FileService.getAllFiles();
                const folders = await FolderService.getAllFolders(path);
                setFiles(files);
                setFolders(folders);
            } catch (err: AxiosError | any) {
                notifyError.setValue("Error: " + err.response.data.message);
            }
        }
        getFiles();
    }, [user, router.pathname]);

    return (
        <MainLayout>
            <LeftBar />
            <Notifier
                text={authError || notifyError.value || notifyText.value}
                color={`${(authError || notifyError.value) ? "red" : "green"}`}
            />

            <div className="container">
                <div className="space-between  --border-bottom">
                    <Profile
                        user={user}
                        handleLogout={handleLogout}
                        handleChangePassword={handleChangePassword}
                    />
                </div>

                <h1 className={styles.title}>Your Files</h1>

                <div className="space-between  --border-bottom">
                    <ActionButtons
                        selectedFiles={selectedFiles}
                        setFiles={setFiles}
                        setSelectedFiles={setSelectedFiles}
                        setNotifyText={notifyText.setValue}
                        setNotifyError={notifyError.setValue}
                    />
                    <ControlButtons
                        sort={sort}
                        setSort={setSort}
                    />
                </div>

                <FolderGrid
                    folders={folders}
                />

                <FileGrid
                    sort={sort}
                    files={files}
                    selectFile={selectFile}
                    selectedFiles={selectedFiles}
                />
            </div>
        </MainLayout>
    )
}

export default Home
