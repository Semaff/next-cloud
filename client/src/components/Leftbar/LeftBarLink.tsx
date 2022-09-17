import styles from "./LeftBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

interface LeftBarLinkProps {
    children: string;
    path: string;
    img: string;
}

const LeftBarLink = ({ children, path, img }: LeftBarLinkProps) => {
    const router = useRouter();

    return (
        <li className={`${styles.leftbar__link} ${router.asPath === path ? styles.active : ""}`}>
            <Link href={path}>
                <a>
                    <Image width={25} height={25} src={img} alt={children} />
                    {children}
                </a>
            </Link>
        </li>
    )
}

export default LeftBarLink;