import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import styles from "../../styles/blocks/LeftBar.module.scss";

const LeftBar = () => {
    const router = useRouter();

    return (
        <div className={styles.leftbar}>
            <div className={styles.leftbar__header}>
                <Logo />

                <ul className={styles.leftbar__list}>
                    <li className={[styles.leftbar__item, `${router.pathname === "/" && styles.active}`].join(" ")}>
                        <Link href="/">
                            <a>
                                <Image width={25} height={25} src="/file.png" alt="file" /> Files
                            </a>
                        </Link>
                    </li>
                    <li className={[styles.leftbar__item, `${router.pathname === "/upload" && styles.active}`].join(" ")}>
                        <Link href="/upload">
                            <a>
                                <Image width={25} height={25} src="/upload.png" alt="upload" /> Upload File
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LeftBar;