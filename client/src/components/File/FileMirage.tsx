import styles from "./File.module.scss";
import Image from "next/image";
import { MiniModal } from "..";
import { MouseEvent } from "react";

interface FileMirageProps {
    isVisible: boolean;
    coords: { x: number, y: number }
    onMouseUp: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
}

const FileMirage = ({ isVisible, coords, onMouseUp, onMouseMove }: FileMirageProps) => {
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
            }}>
            <div className={styles.file__mirage}>
                <Image
                    width={40}
                    height={40}
                    src={"/file.png"}
                    alt={"Move Files"}
                />
            </div>
        </MiniModal>
    )
}

export default FileMirage;