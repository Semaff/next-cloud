import styles from "../styles/pages/Auth.module.scss";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthForm, Notifier } from "../components";
import { useAuth } from "../context/authContext";

const Signup = () => {
    const { isLoggedIn, authError, signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (username: string, password: string) => {
        if (username && password) {
            signup(username, password);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/")
        }
    }, [isLoggedIn]);

    return (
        <MainLayout title="Sign Up | DropBox" small center>
            <AuthForm handleSubmit={handleSubmit} btnText="Sign Up" />
            <Notifier text={authError} color="red" />
            <h5 className={styles.info}>
                Already have an account?
                <Link href="/signin">
                    <a> Sign In</a>
                </Link>
            </h5>
        </MainLayout>
    )
}

export default Signup;