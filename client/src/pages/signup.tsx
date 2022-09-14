import styles from "../styles/pages/Auth.module.scss";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { AuthFormWithNameFields } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { GetServerSideProps } from "next";
import { wrapper } from "../store/store";
import { useRouter } from "next/router";
import { signup } from "../store/slices/auth/actions";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/auth/authSlice";

const Signup = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const handleSignUp = async (firstname: string, lastname: string, email: string, password: string) => {
        dispatch(signup({ firstname, lastname, email, password }));
    }

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn]);

    return (
        <>
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

export default Signup;