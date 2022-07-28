import Image from "next/image";
import styles from "../../styles/blocks/File.module.scss";

const File = () => {
    return (
        <div className={styles.file}>
            <Image
                width={170}
                height={100}
                src="/1.png"
                alt="1"
            />

            <h4 className={styles.file__name}>Shoes</h4>
            <h5 className={styles.file__size}>1.0 GB</h5>
        </div>
    )
}

export default File;