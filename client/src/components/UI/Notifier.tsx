import styles from "../../styles/blocks/Notifier.module.scss";

interface NotifierProps {
    text: string | null;
    color?: string;
}

const Notifier = ({ text, color }: NotifierProps) => {
    if (!text) {
        return null;
    }

    return (
        <div className={styles.notifier} style={{ color }}>
            {text}
        </div>
    )
}

export default Notifier;