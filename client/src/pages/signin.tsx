import styles from "../styles/pages/Auth.module.scss";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { AuthForm } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { GetServerSideProps } from "next";
import { wrapper } from "../store/store";
import { useRouter } from "next/router";
import { signin } from "../store/slices/auth/actions";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/auth/authSlice";
import { useEffect } from "react";

const Signin = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const router = useRouter();

    const handleSignIn = (email: string, password: string) => {
        dispatch(signin({ email, password }));
    }

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn]);

    return (
        <>
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

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async () => {
    /* Redirect to login page if not logged in */
    const isLoggedIn = store.getState().auth.isLoggedIn;
    if (isLoggedIn) {
        return {
            redirect: {
                destination: "/",
                permanent: true
            }
        }
    }

    return {
        props: {}
    }
})

export default Signin;