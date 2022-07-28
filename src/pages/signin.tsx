import { useRouter } from "next/router";
import { useAuth } from "../context/authContext";
import AuthForm from "../components/UI/AuthForm";
import Link from "next/link";
import { useEffect } from "react";
import styles from "../styles/blocks/Auth.module.scss";

const Signin = () => {
    const { isLoggedIn, signin } = useAuth();
    const router = useRouter();

    const handleSubmit = (username: string, password: string) => {
        if (username && password) {
            signin(username, password);
            router.push('/');
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/")
        }
    }, [isLoggedIn]);

    return (
        <main className={styles.main}>
            <AuthForm handleSubmit={handleSubmit} btnText="Sign In" />
            <h5 className={styles.info}>
                Don't have an account?
                <Link href="/signup">
                    <a> Sign Up</a>
                </Link>
            </h5>
        </main>
    )
}

export default Signin;