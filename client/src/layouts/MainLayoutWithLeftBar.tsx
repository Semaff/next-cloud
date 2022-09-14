import { ReactNode } from "react";
import { LeftBar } from "../components";
import MainLayout, { MainLayoutProps } from "./MainLayout";

interface MainLayoutWithLeftBarProps extends MainLayoutProps {
    children: ReactNode
}

const MainLayoutWithLeftBar = (props: MainLayoutWithLeftBarProps) => {
    return (
        <MainLayout {...props}>
            <LeftBar />

            <div className="container">
                {props.children}
            </div>
        </MainLayout>
    )
}

export default MainLayoutWithLeftBar;