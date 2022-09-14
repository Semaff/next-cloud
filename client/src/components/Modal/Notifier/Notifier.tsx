import { ReactNode } from "react";
import MiniModal from "../MiniModal";

interface NotifierProps {
    children: ReactNode;
    color?: string;
}

const Notifier = ({ children, color }: NotifierProps) => {
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

export default Notifier;