import styles from "../styles/pages/Home.module.scss";
import MainLayoutWithLeftBar from "../layouts/MainLayoutWithLeftBar";
import { FileGrid, Modal, NameForm, NameFormWithButton, Profile, SortButtons } from "../components";
import { useRouter } from "next/router";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectFiles } from "../store/slices/files/filesSlice";
import { selectIsLoggedIn, selectUser } from "../store/slices/auth/authSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { TFile } from "../types/TFile";
import { renameFile, searchFiles } from "../store/slices/files/actions";
import { ESorts } from "../types/ESorts";
import { NextPage } from "next";
import { wrapper } from "../store/store";

const SearchPage: NextPage = () => {
    const [currentSort, setCurrentSort] = useState(ESorts.NAME);
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);

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

    const handleSearch = (query: string) => {
        router.push(`/search?query=${query}`);
    }

    const handleRenameFile = (name: string) => {
        const file = selectedFiles[0];
        dispatch(renameFile({ name, file }));
        setIsRenameModalVisible(false);
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

                        <h1 className={styles.home__title}>Search results for: {router.query.query}</h1>

                        <div className={styles.home__block}>
                            <SortButtons
                                currentSort={currentSort}
                                setCurrentSort={setCurrentSort}
                            />
                        </div>
                    </div>

                    <div className={styles.home__body}>
                        <FileGrid
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

SearchPage.getInitialProps = wrapper.getInitialPageProps(store => async (ctx) => {
    await store.dispatch(searchFiles({ ctx }));

    return {
        props: {}
    }
})

export default SearchPage;