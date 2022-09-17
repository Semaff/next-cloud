import { CSSProperties, ReactNode } from "react";
import styles from "./Modal.module.scss";

export interface ModalProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    children?: ReactNode | string;
    style?: CSSProperties;
}

const Modal = ({ isVisible, setIsVisible, children, style }: ModalProps) => {
    return (
        <div className={`${styles.modal} ${isVisible ? styles.visible : ""}`} onClick={() => setIsVisible(false)}>
            <div className={styles.modal__inner} style={style} onClick={e => e.stopPropagation()}>
                <div className={styles.modal__close} onClick={() => setIsVisible(false)}>X</div>
                {children}
            </div>
        </div>
    )
}

export default Modal;