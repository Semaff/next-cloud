import styles from "../styles/pages/Home.module.scss";
import MainLayoutWithLeftBar from "../layouts/MainLayoutWithLeftBar";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import { ActionButtons, NameForm, FileGrid, Modal, MyInputWithLabel, Profile, SortButtons, FileDrag, ContextMenu } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectIsLoggedIn, selectUser } from "../store/slices/auth/authSlice";
import { ESorts } from "../types/ESorts";
import { TFile } from "../types/TFile";
import { NextPage } from "next";
import { wrapper } from "../store/store";
import { selectFiles, setFilesError } from "../store/slices/files/filesSlice";
import { createFolder, fetchFiles, moveFile } from "../store/slices/files/actions";

const Home: NextPage = () => {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [anchor, setAnchor] = useState({ x: 0, y: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [curSort, setCurSort] = useState<ESorts>(ESorts.NAME);
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const files = useTypedSelector(selectFiles);
    const user = useTypedSelector(selectUser);
    const isLoggedIn = useTypedSelector(selectIsLoggedIn);

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [mirageAnchor, setMirageAnchor] = useState({ x: 0, y: 0 });

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

    const handleCreateFolder = (name: string) => {
        if (name.toLowerCase() === "profile" || name.toLowerCase() === "shared") {
            dispatch(setFilesError("You can't create folders with reserved names!"));
        } else {
            dispatch(createFolder({ path: router.asPath, name }));
        }

        setIsModalVisible(false);
    }

    const handleMouseDown = (e: MouseEvent<HTMLElement>, file: TFile) => {
        if (selectedFiles.length <= 1 && !e.ctrlKey && !e.shiftKey) {
            setSelectedFiles([file]);
        }

        setIsMouseDown(true);

        const newPosition = {
            x: e.pageX,
            y: e.pageY,
        };

        setMirageAnchor(newPosition);
    }

    const handleMouseUp = (e: MouseEvent<HTMLElement>, file?: TFile) => {
        setIsMouseDown(false);
        setIsDragging(false);

        if (!file || file.type !== "dir" || selectedFiles.find(fileEl => fileEl.id === file.id)) {
            return;
        }

        if (isDragging) {
            const parentId = file.id;
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                dispatch(moveFile({ fileId: file.id, parentId }))
            }
        }
    }

    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        const dx = Math.abs(e.pageX - mirageAnchor.x) >= 20;
        const dy = Math.abs(e.pageY - mirageAnchor.y) >= 20;

        if ((isMouseDown && (dx || dy)) || isDragging) {
            setIsDragging(true);

            const newPosition = {
                x: e.pageX,
                y: e.pageY,
            };

            setMirageAnchor(newPosition);
        }
    }

    return (
        <div onClick={() => setIsContextMenuOpen(false)}>
            <FileDrag
                isVisible={isMouseDown && isDragging}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                coords={mirageAnchor}
            />

            <ContextMenu
                selectedFiles={selectedFiles}
                setIsContextMenuOpen={setIsContextMenuOpen}
                isVisible={isContextMenuOpen}
                coords={anchor}
            />

            <Modal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
                <NameForm
                    onSubmit={handleCreateFolder}
                    btnText="Create folder"
                    labelText="Enter folder's name"
                />
            </Modal>

            <MainLayoutWithLeftBar>
                <div className={styles.home}>
                    <div className={styles.home__block}>
                        <MyInputWithLabel view="horizontal" styles={{ maxWidth: "40rem" }}>
                            Search
                        </MyInputWithLabel>

                        <Profile user={user} />
                    </div>

                    <h1 className={styles.home__title}>Your Files</h1>

                    <div className={styles.home__block}>
                        <ActionButtons
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            setIsModalVisible={setIsModalVisible}
                        />
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
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    />
                </div>
            </MainLayoutWithLeftBar>
        </div>
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