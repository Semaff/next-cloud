import Image from "next/image";
import styles from "../styles/blocks/LeftBar.module.scss";
import Logo from "./UI/Logo";

const LeftBar = () => {
    return (
        <div className={styles.leftbar}>
            <div className={styles.leftbar__header}>
                <Logo />

                <ul className={styles.leftbar__list}>
                    <li className={[styles.leftbar__item, styles.active].join(" ")}>
                        <a href="#a">
                            <Image width={25} height={25} src="/file.png" alt="file" /> Files
                        </a>
                    </li>
                    <li className={styles.leftbar__item}>
                        <a href="#a">
                            <Image width={25} height={25} src="/get-started.png" alt="get-started" /> Get Started
                        </a>
                    </li>
                </ul>
            </div>

            <h4 className={styles.leftbar__footer}>
                Amount of files: 10128189
            </h4>
        </div>
    )
}

export default LeftBar;