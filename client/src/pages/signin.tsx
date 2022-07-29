import styles from "../styles/pages/Auth.module.scss";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthForm, Notifier } from "../components";
import { useAuth } from "../context/authContext";

const Signin = () => {
    const { isLoggedIn, authError, signin } = useAuth();
    const router = useRouter();

    const handleSubmit = (username: string, password: string) => {
        if (username && password) {
            signin(username, password);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/")
        }
    }, [isLoggedIn]);

    return (
        <MainLayout title="Sign In | DropBox" small center>
            <AuthForm handleSubmit={handleSubmit} btnText="Sign In" />
            <Notifier text={authError} color="red" />
            <h5 className={styles.info}>
                Don't have an account?
                <Link href="/signup">
                    <a> Sign Up</a>
                </Link>
            </h5>
        </MainLayout>
    )
}

export default Signin;