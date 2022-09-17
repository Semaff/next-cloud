import styles from "./Spinner.module.scss";
import Spinner from "./Spinner";

const SpinnerWithBG = () => {
    return (
        <div className={styles.spinner__bg}>
            <Spinner />
        </div>
    )
}

export default SpinnerWithBG;