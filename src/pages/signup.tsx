import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthForm from "../components/UI/AuthForm";
import { useAuth } from "../context/authContext";
import styles from "../styles/blocks/Auth.module.scss";

const Signup = () => {
    const { isLoggedIn, signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (username: string, password: string) => {
        if (username && password) {
            signup(username, password);
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
            <AuthForm handleSubmit={handleSubmit} btnText="Sign Up" />
            <h5 className={styles.info}>
                Already have an account?
                <Link href="/signin">
                    <a> Sign In</a>
                </Link>
            </h5>
        </main>
    )
}

export default Signup;