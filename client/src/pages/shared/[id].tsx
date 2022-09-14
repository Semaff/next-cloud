import styles from "../../styles/pages/Shared.module.scss";
import MainLayout from "../../layouts/MainLayout";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { wrapper } from "../../store/store";
import { MyButton } from "../../components";
import { useSelector } from "react-redux";
import { request } from "../../api/requests";
import { selectFile } from "../../store/slices/files/filesSlice";
import { fetchFile } from "../../store/slices/files/actions";

const SharedItemPage = () => {
    const file = useSelector(selectFile);

    if (!file) {
        return (
            <MainLayout title="CloudBox" small withPadding>
                <h1>This file doesn't exist!</h1>
            </MainLayout>
        )
    }

    const handleDownloadFile = async () => {
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

    return (
        <>
            <MainLayout title="CloudBox" small withPadding>
                <div className={styles.item__image}>
                    {(file && file.type === "image")
                        ?
                        <img
                            className={styles.file__image}
                            width={200}
                            height={220}
                            src={`http://localhost:5000/${file?.path}`}
                            alt={file.name}
                        />
                        :
                        <Image
                            className={styles.file__image}
                            width={200}
                            height={220}
                            src={file.type === "dir" ? "/folder.png" : "/file.png"}
                            alt={file.name}
                        />
                    }
                </div>

                <div className={styles.item__footer}>
                    <h2>{file.name}</h2>

                    <MyButton className="--filled" onClick={handleDownloadFile}>
                        Download file {file.name}
                    </MyButton>
                </div>
            </MainLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    await store.dispatch(fetchFile({ ctx }));
    
    return {
        props: {}
    }
});

export default SharedItemPage;