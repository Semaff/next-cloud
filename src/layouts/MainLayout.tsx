import Head from "next/head";
import { ReactNode } from "react";
import LeftBar from "../components/LeftBar";

interface MainLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

const MainLayout = ({ children, title, description }: MainLayoutProps) => {
    return (
        <>
            <Head>
                <title>{title || "DropBox"}</title>
                <meta name="description" content={description || "This is my first Home Page"} />
                <link rel="icon" href="/icon.ico" />
            </Head>

            <main className="main">
                <LeftBar />
                <div className="container">
                    {children}
                </div>
            </main>
        </>
    )
}

export default MainLayout;