import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { AppWrapper } from '../context/authContext'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AppWrapper>
            <Component {...pageProps} />
        </AppWrapper>
    )
}

export default MyApp
