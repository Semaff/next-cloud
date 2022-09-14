import '../styles/globals.scss'
import { wrapper } from '../store/store';
import { AppContext, AppProps } from 'next/app';
import { auth } from '../store/slices/auth/actions';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <Component {...pageProps} />
    )
}

MyApp.getInitialProps = wrapper.getInitialAppProps(store => async (context: AppContext) => {
    await store.dispatch(auth({ ctx: context.ctx }));

    return {
        pageProps: {
            // Call page-level getInitialProps
            // DON'T FORGET TO PROVIDE STORE TO PAGE
            ...(context.Component.getInitialProps ? await context.Component.getInitialProps({ ...context.ctx, store }) : {}),
            // Some custom thing for all pages
            pathname: context.ctx.pathname,
        },
    };
});

export default wrapper.withRedux(MyApp);
