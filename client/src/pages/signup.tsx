import styles from "../styles/pages/Auth.module.scss";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthFormWithNameFields, Notifier } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectAuthError, selectAuthIsLoading, selectIsLoggedIn, signup } from "../store/slices/auth/authSlice";

const Signup = () => {
    const router = useRouter();
    const authError = useTypedSelector(selectAuthError);
    const authIsLoading = useTypedSelector(selectAuthIsLoading);
    const isLoggedIn = useTypedSelector(selectIsLoggedIn);
    const dispatch = useAppDispatch();

    const handleSignUp = async (firstname: string, lastname: string, email: string, password: string) => {
        dispatch(signup({ firstname, lastname, email, password }));
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

            <MainLayout title="Sign Up | CloudBox" small withPadding>
                <AuthFormWithNameFields
                    onSubmit={handleSignUp}
                    btnText="Sign Up"
                    titleText="Registration"
                />

                <div className={styles.auth__footer}>
                    <h5 className={styles.auth__redirect}>
                        Already have an account?
                        <span> <Link href="/signin">
                            <a>Sign In</a>
                        </Link></span>
                    </h5>
                </div>
            </MainLayout>
        </>
    )
}

export default Signup;