import Head from "next/head";
import SpinnerWithBG from "../components/Spinner/SpinnerWithBG";
import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectAuthError, selectAuthIsLoading, selectIsLoggedIn, setAuthError } from "../store/slices/auth/authSlice";
import { selectFilesError, setFilesError } from "../store/slices/files/filesSlice";
import { Notifier } from "../components";

export interface MainLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    small?: boolean;
    withPadding?: boolean;
}

const MainLayout = ({ children, title, description, small, withPadding }: MainLayoutProps) => {
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const authError = useTypedSelector(selectAuthError);
    const authIsLoading = useTypedSelector(selectAuthIsLoading);
    const filesError = useTypedSelector(selectFilesError);
    const dispatch = useAppDispatch();

    const mainStyles = ["main"];
    if (small) mainStyles.push("--small");
    if (withPadding) mainStyles.push("--padding");

    useEffect(() => {
        if (timer) {
            clearTimeout(timer);
        }

        if (authError || filesError) {
            setTimer(setTimeout(() => {
                dispatch(setAuthError(null));
                dispatch(setFilesError(null));
            }, 2000));
        }
    }, [authError, filesError]);

    return (
        <>
            <Head>
                <title>{title || "CloudBox"}</title>
                <meta name="description" content={description || "This is my first Home Page"} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {authIsLoading && (
                <SpinnerWithBG />
            )}

            <Notifier color="red">
                {
                    authError ||
                    filesError
                }
            </Notifier>

            <main className={mainStyles.join(" ")}>
                {children}
            </main>
        </>
    )
}

export default MainLayout;