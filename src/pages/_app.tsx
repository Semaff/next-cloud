import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { AppWrapper, useAuth } from '../context/authContext'
import { Spinner } from '../components';

function MyApp({ Component, pageProps }: AppProps) {
    const { isLoading } = useAuth();

    return (!isLoading
        ?
        (
            <AppWrapper>
                <Component {...pageProps} />
            </AppWrapper>
        )
        : <Spinner />
    )
}

export default MyApp
