import styles from "../../styles/pages/Home.module.scss";
import MainLayoutWithLeftBar from "../../layouts/MainLayoutWithLeftBar";
import { FileGrid, Modal, MyInputWithLabel, NameForm, NameFormWithButton, Profile, SortButtons } from "../../components";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectUser } from "../../store/slices/auth/authSlice";
import { useEffect, useState } from "react";
import { ESorts } from "../../types/ESorts";
import { selectFiles } from "../../store/slices/files/filesSlice";
import { TFile } from "../../types/TFile";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { wrapper } from "../../store/store";
import { fetchSharedFiles, renameFile } from "../../store/slices/files/actions";
import { useAppDispatch } from "../../hooks/useAppDispatch";

const SharedPage: NextPage = () => {
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const [currentSort, setCurrentSort] = useState(ESorts.NAME);
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const user = useSelector(selectUser);
    const files = useSelector(selectFiles);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const router = useRouter();
    const dispatch = useAppDispatch();

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

    const handleSearch = (query: string) => {
        router.push(`/search?query=${query}`);
    }

    return (
        <>
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

            <MainLayoutWithLeftBar title="Shared Files | CloudBox">
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

                        <h1 className={styles.home__title}>Shared Files</h1>

                        <div className={styles.home__block}>
                            <SortButtons
                                currentSort={currentSort}
                                setCurrentSort={setCurrentSort}
                            />
                        </div>
                    </div>

                    <div className={styles.home__body}>
                        <FileGrid
                            files={files}
                            currentSort={currentSort}
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

SharedPage.getInitialProps = wrapper.getInitialPageProps(store => async (ctx) => {
    await store.dispatch(fetchSharedFiles({ ctx }));

    return {
        props: {}
    }
})

export default SharedPage;