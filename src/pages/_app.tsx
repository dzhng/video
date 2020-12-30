import App from 'next/app';
import Router from 'next/router';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import '~/utils/progress-indicator';
import theme from '~/theme';
import Head from '~/components/App/Head';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
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
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            variant="info"
          >
            <Head />
            <CssBaseline />
            <PendingWrite />
            <Component previousPage={previousPage} {...pageProps} />
          </SnackbarProvider>
        </AppStateProvider>
      </MuiThemeProvider>
    );
  }
}

export default MyApp;
