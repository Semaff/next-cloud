import styles from "./Modal.module.scss";
import { CSSProperties, MouseEvent, ReactNode } from "react";

export interface MiniModalProps {
    isVisible: boolean;
    children?: ReactNode | string;
    style?: CSSProperties;
    isTransparent?: boolean;
    onMouseUp?: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseMove?: (e: MouseEvent<HTMLDivElement>) => void;
}

const MiniModal = (props: MiniModalProps) => {
    const {
        isVisible,
        children,
        style,
        isTransparent,
        onMouseUp,
        onMouseDown,
        onMouseMove
    } = props;

    const miniModalStyles = [styles.minimodal];
    if (isVisible) {
        miniModalStyles.push(styles.visible);
    }

    if (isTransparent) {
        miniModalStyles.push(styles.transparent);
    }

    return (
        <div
            className={miniModalStyles.join(" ")}
            style={style}
            onClick={e => e.stopPropagation()}
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
        >
            {children}
        </div>
    )
}

export default MiniModal;