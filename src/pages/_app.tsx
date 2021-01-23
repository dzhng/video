import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import '~/utils/progress-indicator';
import { isMobile } from '~/utils';
import theme from '~/theme';
import Head from '~/components/App/Head';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
import ErrorDialog from '~/components/ErrorDialog/ErrorDialog';
import IntercomLoader from '~/components/IntercomLoader/IntercomLoader';
import AppStateProvider from '~/state';

import './styles.css';

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
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          variant="info"
        >
          <Head />
          <CssBaseline />
          <PendingWrite />
          <ErrorDialog />
          {!isMobile && <IntercomLoader />}
          <Component previousPage={previousPage} {...pageProps} />
        </SnackbarProvider>
      </AppStateProvider>
    </MuiThemeProvider>
  );
}
