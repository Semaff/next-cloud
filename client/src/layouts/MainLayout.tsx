import Head from "next/head";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
    small?: boolean;
    center?: boolean
    title?: string;
    description?: string;
}

const MainLayout = ({ children, title, description, small, center }: MainLayoutProps) => {
    return (
        <>
            <Head>
                <title>{title || "DropBox"}</title>
                <meta name="description" content={description || "This is my first Home Page"} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={`main ${small ? "--small" : ""} ${center ? "--center" : ""}`}>
                {children}
            </main>
        </>
    )
}

export default MainLayout;