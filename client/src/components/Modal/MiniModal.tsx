import { ModalProps } from "./Modal";
import styles from "../../styles/blocks/Modal.module.scss";

const MiniModal = ({ isVisible, children, style }: ModalProps) => {
    return (
        <div className={`${styles.minimodal} ${isVisible ? styles.visible : ""}`} style={style}>
            {children}
        </div>
    )
}

export default MiniModal;