import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '~/theme';
import Head from '~/components/App/Head';
import AppStateProvider from '~/state';

// configure global loading spinner
// ONLY show if page has been loading for more than a set period
// no need to load if already cached on client
const showLoadingThresholdMS = 200;
let isLoading = false;
let previousPage = '';

NProgress.configure({
  trickleSpeed: 100,
  minimum: 0.3,
});

Router.onRouteChangeStart = () => {
  isLoading = true;
  setTimeout(() => {
    if (isLoading) {
      NProgress.start();
    }
  }, showLoadingThresholdMS);
};

Router.onRouteChangeComplete = () => {
  isLoading = false;
  NProgress.done();
};

Router.onRouteChangeError = () => {
  isLoading = false;
  NProgress.done();
};

Router.beforeHistoryChange = (url) => {
  previousPage = url;
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <AppStateProvider>
          <Head />
          <CssBaseline />
          <Component previousPage={previousPage} {...pageProps} />
        </AppStateProvider>
      </MuiThemeProvider>
    );
  }
}

export default MyApp;
