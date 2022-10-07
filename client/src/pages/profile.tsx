import styles from "../styles/pages/Profile.module.scss";
import MainLayoutWithLeftBar from "../layouts/MainLayoutWithLeftBar";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect } from "react";
import { useSelector } from "react-redux";
import { ChangePasswordForm, MyButton, MyUpload } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { GetServerSideProps } from "next";
import { wrapper } from "../store/store";
import {
  selectAuthIsLoading,
  selectIsLoggedIn,
  selectUser
} from "../store/slices/auth/authSlice";
import {
  changePassword,
  deleteAccount,
  logout,
  removeAvatar,
  uploadAvatar
} from "../store/slices/auth/actions";

const ProfilePage = () => {
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const authIsLoading = useSelector(selectAuthIsLoading);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleChangePassword = (newPassword: string) => {
    dispatch(changePassword({ newPassword }));
  };

  const handleUploadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadAvatar({ file }));
    }
  };

  const handleRemoveAvatar = () => {
    dispatch(removeAvatar());
  };

  const handleDeleteAccount = () => {
    dispatch(deleteAccount());
  };

  useEffect(() => {
    if (!isLoggedIn && !authIsLoading) {
      router.push("/signin");
    }
  }, [isLoggedIn]);

  return (
    <>
      <MainLayoutWithLeftBar title="Profile | CloudBox">
        <div className={styles.profile}>
          <span className={styles["profile__name"]}>
            Name: {user?.firstname} {user?.lastname}
          </span>

          <span className={styles["profile__name"]}>
            Created at: {new Date(user?.createdAt || "").getFullYear()}
          </span>

          <div className={styles.profile__avatar}>
            <img
              // src={
              //   !user?.avatar
              //     ? "/avatar.png"
              //     : `http://localhost:5000/${user.avatar}`
              // }
              src={"/avatar.png"}
              alt="avatar"
              width={200}
              height={200}
            />

            <div className={styles["profile__btns"]}>
              <MyUpload
                name="upload-avatar"
                onChange={(e) => handleUploadAvatar(e)}
              >
                Upload Avatar
              </MyUpload>
              <MyButton className="--filled" onClick={handleRemoveAvatar}>
                Remove Avatar
              </MyButton>
            </div>
          </div>

          <div className={styles["profile__info"]}>
            <span
              className={styles["profile__activation"]}
              style={{ fontSize: "3rem" }}
            >
              {user?.isActivated ? (
                <>
                  <span>Email is already activated!</span>
                </>
              ) : (
                <>
                  <span>You must activate your account: </span>
                  <a href={user?.activationLink}>Activate By Link</a>
                </>
              )}
            </span>
          </div>

          <div className={styles.profile__form}>
            <ChangePasswordForm onSubmit={handleChangePassword} />
          </div>

          <div className={`${styles["profile__btns"]} --horizontal`}>
            <MyButton className="--filled" onClick={() => dispatch(logout())}>
              Logout
            </MyButton>
            <MyButton className="--filled" onClick={handleDeleteAccount}>
              Delete account
            </MyButton>
          </div>
        </div>
      </MainLayoutWithLeftBar>
    </>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    /* Redirect to login page if not logged in */
    const isLoggedIn = store.getState().auth.isLoggedIn;
    if (!isLoggedIn) {
      return {
        redirect: {
          destination: "/signin",
          permanent: true
        }
      };
    }

    return {
      props: {}
    };
  });

export default ProfilePage;
