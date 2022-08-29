import { ReactNode } from "react";
import MiniModal from "./MiniModal";

interface MiniModalNotifierProps {
    children: ReactNode;
    color?: string;
}

const MiniModalNotifier = ({ children, color }: MiniModalNotifierProps) => {
    if (!children) {
        return null;
    }

    return (
        <MiniModal isVisible={!!children} style={{
            color: color || "green",
            top: "10%",
            right: "50%",
            transform: "translateX(50%)",
            maxWidth: "28rem"
        }}>
            {children}
        </MiniModal>
    )
}

export default MiniModalNotifier;