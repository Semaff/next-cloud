import styles from "../../styles/pages/Home.module.scss";
import MainLayoutWithLeftBar from "../../layouts/MainLayoutWithLeftBar";
import { ContextMenu, FileGrid, MyInputWithLabel, Profile, SortButtons } from "../../components";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectUser } from "../../store/slices/auth/authSlice";
import { MouseEvent, useEffect, useState } from "react";
import { ESorts } from "../../types/ESorts";
import { selectFiles } from "../../store/slices/files/filesSlice";
import { TFile } from "../../types/TFile";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { wrapper } from "../../store/store";
import { fetchSharedFiles } from "../../store/slices/files/actions";

const SharedPage: NextPage = () => {
    const [anchor, setAnchor] = useState({ x: 0, y: 0 });
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [curSort, setCurSort] = useState<ESorts>(ESorts.NAME);
    const user = useSelector(selectUser);
    const files = useSelector(selectFiles);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/signin");
        }
    }, []);

    const handleShowContextMenu = (e: MouseEvent<HTMLDivElement>, file: TFile) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFiles([file]);

        setIsContextMenuOpen(false);
        const newPosition = {
            x: e.pageX,
            y: e.pageY,
        };

        setAnchor(newPosition);
        setIsContextMenuOpen(true);
    }

    return (
        <div onClick={() => setIsContextMenuOpen(false)}>
            <ContextMenu
                selectedFiles={selectedFiles}
                setIsContextMenuOpen={setIsContextMenuOpen}
                isVisible={isContextMenuOpen}
                coords={anchor}
            />

            <MainLayoutWithLeftBar title="Shared Files | CloudBox">
                <div className={styles.home}>
                    <div className={styles.home__block}>
                        <MyInputWithLabel view="horizontal" styles={{ maxWidth: "40rem" }}>
                            Search
                        </MyInputWithLabel>

                        <Profile user={user} />
                    </div>

                    <h1 className={styles.home__title}>Shared Files</h1>

                    <div className={styles.home__block}>
                        <SortButtons
                            curSort={curSort}
                            setCurSort={setCurSort}
                        />
                    </div>

                    <FileGrid
                        curSort={curSort}
                        files={files}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        handleShowContextMenu={handleShowContextMenu}
                        setIsContextMenuOpen={setIsContextMenuOpen}
                    />
                </div>
            </MainLayoutWithLeftBar>
        </div>
    )
}

SharedPage.getInitialProps = wrapper.getInitialPageProps(store => async (ctx) => {
    await store.dispatch(fetchSharedFiles({ ctx }));
    return {
        props: {}
    }
})

export default SharedPage;