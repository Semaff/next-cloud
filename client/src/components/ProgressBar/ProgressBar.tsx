import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
    progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
    return (
        <div className={styles.progress}>
            <div className={styles.progress__value} style={{ width: `${progress}%` }} />
        </div>
    )
}

export default ProgressBar;