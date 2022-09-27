import styles from "../styles/pages/Home.module.scss";
import MainLayoutWithLeftBar from "../layouts/MainLayoutWithLeftBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ActionButtons, NameForm, Modal, Profile, SortButtons, FileGridWithDragNDrop, NameFormWithButton, Uploader } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectIsLoggedIn, selectUser } from "../store/slices/auth/authSlice";
import { ESorts } from "../types/ESorts";
import { TFile } from "../types/TFile";
import { NextPage } from "next";
import { wrapper } from "../store/store";
import { selectFiles } from "../store/slices/files/filesSlice";
import { createFolder, fetchFiles, renameFile } from "../store/slices/files/actions";
import { ERoutes } from "../types/ERoutes";

const Home: NextPage = () => {
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState(ESorts.NAME);
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const files = useTypedSelector(selectFiles);
    const user = useTypedSelector(selectUser);
    const isLoggedIn = useTypedSelector(selectIsLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/signin");
        }
    }, []);

    const handleRenameFile = (name: string) => {
        const file = selectedFiles[0];
        dispatch(renameFile({ name, file }));
        setIsRenameModalVisible(false);
    }

    const handleCreateFolder = (name: string) => {
        setIsFolderModalVisible(false);
        if (!ERoutes.includes(name.toLowerCase())) {
            return dispatch(createFolder({ path: router.asPath, name }));
        }

        return dispatch(createFolder({ path: router.asPath, name }));
    }

    const handleSearch = (query: string) => {
        router.push(`/search?query=${query}`);
    }

    return (
        <>
            <Modal isVisible={isFolderModalVisible} setIsVisible={setIsFolderModalVisible}>
                <NameFormWithButton
                    onSubmit={handleCreateFolder}
                    btnText="Create folder"
                    labelText="Enter folder's name"
                />
            </Modal>

            <Modal isVisible={isRenameModalVisible} setIsVisible={setIsRenameModalVisible}
                style={{
                    width: "30rem",
                    borderRadius: "3px"
                }}>
                <NameFormWithButton
                    onSubmit={handleRenameFile}
                    btnText="Rename file"
                    labelText="Enter new file's name"
                />
            </Modal>

            <Uploader />

            <MainLayoutWithLeftBar>
                <div className={styles.home}>
                    <div className={styles.home__head}>
                        <div className={styles.home__block}>
                            <NameForm
                                view="horizontal"
                                labelText="Search"
                                onSubmit={handleSearch}
                                style={{ maxWidth: "50rem" }}
                            />

                            <Profile user={user} />
                        </div>

                        <h1 className={styles.home__title}>Your Files</h1>

                        <div className={styles.home__block}>
                            <ActionButtons
                                selectedFiles={selectedFiles}
                                setSelectedFiles={setSelectedFiles}
                                setIsModalVisible={setIsFolderModalVisible}
                            />
                            <SortButtons
                                currentSort={currentSort}
                                setCurrentSort={setCurrentSort}
                            />
                        </div>
                    </div>

                    <div className={styles.home__body}>
                        <FileGridWithDragNDrop
                            currentSort={currentSort}
                            files={files}
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            setIsRenameModalVisible={setIsRenameModalVisible}
                        />
                    </div>
                </div>
            </MainLayoutWithLeftBar>
        </>
    )
}

Home.getInitialProps = wrapper.getInitialPageProps(store => async (ctx) => {
    /* Get Files */
    await store.dispatch(fetchFiles({ ctx }));

    return {
        props: {}
    }
})

export default Home