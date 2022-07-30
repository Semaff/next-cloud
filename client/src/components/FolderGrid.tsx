import styles from "../styles/blocks/File.module.scss";
import { TFolder } from "../types/TFolder";
import Folder from "./Folder";

interface FolderGridProps {
    folders: TFolder[];
}

const FolderGrid = ({ folders }: FolderGridProps) => {
    return (
        <section className={styles.file__grid}>
            <div className={styles.file__grid_inner}>
                {folders.map(folder => (
                    <Folder
                        key={folder.id}
                        folder={folder}
                    />
                ))}
            </div>
        </section>
    )
}

export default FolderGrid;