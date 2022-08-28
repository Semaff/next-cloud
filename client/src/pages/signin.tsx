import styles from "../styles/pages/Auth.module.scss";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthForm, Notifier } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectAuthError, selectAuthIsLoading, selectIsLoggedIn, signin } from "../store/slices/auth/authSlice";

const Signin = () => {
    const router = useRouter();
    const authError = useTypedSelector(selectAuthError);
    const authIsLoading = useTypedSelector(selectAuthIsLoading);
    const isLoggedIn = useTypedSelector(selectIsLoggedIn);
    const dispatch = useAppDispatch();

    const handleSignIn = (email: string, password: string) => {
        dispatch(signin({ email, password }));
    }

    useEffect(() => {
        if (isLoggedIn && !authIsLoading) {
            router.push("/");
        }
    }, [isLoggedIn]);

    return (
        <>
            <Notifier
                text={authError?.message}
                color="red"
            />

            <MainLayout title="Sign In | CloudBox" small withPadding>
                <AuthForm
                    onSubmit={handleSignIn}
                    btnText="Sign In"
                    titleText="Authorization"
                />

                <div className={styles.auth__footer}>
                    <h5 className={styles.auth__redirect}>
                        Don't have an account?
                        <span> <Link href="/signup">
                            <a>Sign Up</a>
                        </Link></span>
                    </h5>
                </div>
            </MainLayout>
        </>

    )
}

export default Signin;