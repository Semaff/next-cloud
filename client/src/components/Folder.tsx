import { useRouter } from "next/router";
import styles from "../styles/blocks/File.module.scss";
import { TFolder } from "../types/TFolder";

interface FolderProps {
    folder: TFolder;
}

const Folder = ({ folder }: FolderProps) => {
    const router = useRouter();
    const fileStyles = [styles.folder];

    return (
        <div className={fileStyles.join(" ")} onClick={() => router.push(router.pathname + folder.name)}>
            <div className={styles.file__image}>
                <img
                    width={100}
                    height={100}
                    src={`http://localhost:5000/db/folder.jpg`}
                    alt="1"
                />
            </div>

            <h4 className={styles.file__name}>{folder.name}</h4>
        </div>
    )
}

export default Folder;