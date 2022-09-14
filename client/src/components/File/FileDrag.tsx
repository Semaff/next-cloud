import styles from "../../styles/blocks/File.module.scss";
import Image from "next/image";
import MiniModal from "../Modal/MiniModal";
import { MouseEvent, useMemo } from "react";

interface FileDragProps {
    isVisible: boolean;
    coords: { x: number, y: number }
    onMouseUp: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
}

const FileDrag = (props: FileDragProps) => {
    const {
        isVisible,
        coords,
        onMouseUp,
        onMouseMove
    } = props;

    const imageSize = useMemo(() => 40, []);

    return (
        <MiniModal
            isVisible={isVisible}
            isTransparent
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{
                width: "unset",
                top: coords.y,
                left: coords.x
            }}
        >
            <div className={styles.mirage}>
                <Image
                    width={imageSize}
                    height={imageSize}
                    src={"/file.png"}
                    alt={"Move"}
                />
            </div>
        </MiniModal>
    )
}

export default FileDrag;