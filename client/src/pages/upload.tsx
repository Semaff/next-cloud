import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { authRequest } from "../api/requests";
import { LeftBar, Notifier } from "../components";
import { useAuth } from "../context/authContext";
import UploadSVG from "../components/SVG/UploadSVG";
import MainLayout from "../layouts/MainLayout";
import styles from "../styles/pages/Upload.module.scss";
import useNotifierText from "../hooks/useNotifierText";

const Upload = () => {
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const [cover, setCover] = useState<File | undefined>(undefined);
    const { isLoggedIn, authError } = useAuth();
    const notifyError = useNotifierText("");
    const notifyText = useNotifierText("");
    const router = useRouter();
    const canSubmit = name && file;

    const uploadFile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name)
            formData.append("file", file);

            if (cover) {
                formData.append("cover", cover);
            }

            setFile(undefined);
            setCover(undefined);
            setName("");
            await authRequest.post("api/file/create", formData);
            notifyText.setValue("Uploaded Image!");
        } catch (err: AxiosError | any) {
            notifyError.setValue("Error: " + err.response.data.message);
        }
    }

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/signin");
        }
    }, [isLoggedIn]);

    return (
        <MainLayout title="Upload File | DropBox">
            <LeftBar />
            <Notifier
                text={authError || notifyError.value || notifyText.value}
                color={`${(authError || notifyError.value) ? "red" : "green"}`}
            />

            <div className="container">
                <div className={styles.page}>
                    <h1 className={styles.title}>Upload your files</h1>

                    <form onSubmit={e => uploadFile(e)} className={styles.form}>
                        <div className="input-placeholder --center">
                            <label htmlFor="name" className="label  --big">
                                1. Enter file name:
                            </label>
                            <input
                                className="input --small"
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="input-placeholder --center">
                            <label htmlFor="upload-file" className={`upload-file ${file ? "available" : ""}`}>
                                <UploadSVG />
                                {file
                                    ? file.name
                                    : "2. Upload File"
                                }
                            </label>
                            <input
                                className="input-file"
                                type="file"
                                name="upload-file"
                                id="upload-file"
                                onChange={(e) => setFile(e.target.files?.[0])}
                            />
                        </div>

                        <div className="input-placeholder --center">
                            <label htmlFor="upload-cover" className={`upload-file ${cover ? "available" : ""}`}>
                                <UploadSVG />
                                {cover
                                    ? cover.name
                                    : "3. Upload Cover (Optional)"
                                }
                            </label>
                            <input
                                className="input-file"
                                type="file"
                                name="upload-cover"
                                id="upload-cover"
                                accept="image/*"
                                onChange={(e) => setCover(e.target.files?.[0])}
                            />
                        </div>

                        <button disabled={!canSubmit} type="submit" className="btn  --filled">
                            Send File
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}

export default Upload;