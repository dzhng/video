import App from 'next/app';
import Router from 'next/router';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import '~/utils/progress-indicator';
import theme from '~/theme';
import Head from '~/components/App/Head';
import Layout from '~/containers/Layout/Layout';
import AppStateProvider from '~/state';

let previousPage = '';

Router.events.on('beforeHistoryChange', (url) => {
  previousPage = url;
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <AppStateProvider>
          <Head />
          <CssBaseline />
          <Layout>
            <Component previousPage={previousPage} {...pageProps} />
          </Layout>
        </AppStateProvider>
      </MuiThemeProvider>
    );
  }
}

export default MyApp;
