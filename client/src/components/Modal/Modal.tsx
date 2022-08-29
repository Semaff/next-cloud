import { CSSProperties, ReactNode } from "react";
import styles from "../../styles/blocks/Modal.module.scss";

export interface ModalProps {
    isVisible?: boolean;
    children?: ReactNode | string;
    style?: CSSProperties;
}

const Modal = ({ isVisible, children, style }: ModalProps) => {
    return (
        <div className={`${styles.modal} ${isVisible ? styles.visible : ""}`}>
            <div className={styles.modal__inner} style={style}>
                {children}
            </div>
        </div>
    )
}

export default Modal;