import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import '~/utils/progress-indicator';
import theme from '~/theme';
import Head from '~/components/App/Head';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
import ErrorDialog from '~/components/ErrorDialog/ErrorDialog';
import AppStateProvider from '~/state';

export default function App({ Component, pageProps }: AppProps) {
  const [previousPage, setPreviousPage] = useState<string | undefined>();

  useEffect(() => {
    const handleChange = (url: string) => {
      setPreviousPage(url);
    };
    Router.events.on('beforeHistoryChange', handleChange);
    return Router.events.off('beforeHistoryChange', handleChange);
  }, []);

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
          <ErrorDialog />
          <Component previousPage={previousPage} {...pageProps} />
        </SnackbarProvider>
      </AppStateProvider>
    </MuiThemeProvider>
  );
}
