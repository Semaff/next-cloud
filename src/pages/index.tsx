import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Profile } from '../components';
import ActionButtons from '../components/ActionButtons';
import ControlButtons from '../components/ControlButtons';
import Search from '../components/Search';
import FileGrid from '../components/UI/FileGrid';
import { useAuth } from '../context/authContext';
import MainLayout from '../layouts/MainLayout';
import styles from "../styles/blocks/Home.module.scss";

const Home = () => {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/signin");
        }
    }, [isLoggedIn])

    return (
        <MainLayout>
            <div className="space-between  --border-bottom">
                <Search />
                <Profile />
            </div>

            <h1 className={styles.title}>Your Files</h1>

            <div className="space-between  --border-bottom">
                <ActionButtons />
                <ControlButtons />
            </div>

            <FileGrid />
        </MainLayout>
    )
}

export default Home
