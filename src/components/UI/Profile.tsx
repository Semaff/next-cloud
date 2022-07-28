import styles from "../../styles/blocks/Profile.module.scss"

const Profile = () => {
    return (
        <div className={styles.profile}>
            <button type="button" className={styles.profile__header}>
                <h3 className={styles.profile__name}>Eddie Lobanovsky</h3>
                <span className="arrow" />
            </button>
        </div>
    )
}

export default Profile;