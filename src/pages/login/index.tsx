import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { Typography, Button, Paper, Container } from '@material-ui/core';

import { useAppState } from '~/state';
import LoadingContainer from '~/containers/Loading/Loading';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100vh',
    },
    paper: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '2em',
      marginTop: 'calc(50vh - 150px)',

      '& h1': {
        marginBottom: theme.spacing(1),
      },
      '& p': {
        marginBottom: theme.spacing(1),
      },
    },
    button: {
      color: 'black',
      background: 'white',
      margin: '0.8em 0 0.7em',
      textTransform: 'none',
    },
    errorMessage: {
      color: 'red',
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: '0.4em',
      },
    },
  }),
);

const GoogleLogo = <img src="/google-logo.svg" />;

export default function LoginPage({ previousPage }: { previousPage?: string }) {
  const classes = useStyles();
  const router = useRouter();
  const { signIn, isAuthReady } = useAppState();
  const [authError, setAuthError] = useState<Error | null>(null);

  const login = useCallback(() => {
    setAuthError(null);
    signIn()
      .then(() => {
        router.replace(previousPage ?? '/');
      })
      .catch((err) => setAuthError(err));
  }, [previousPage, router, signIn]);

  if (!isAuthReady) {
    return <LoadingContainer />;
  }

  return (
    <Container maxWidth="xs" className={classes.container} data-testid="container">
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h1">Welcome to Aomni</Typography>
        <Typography variant="body1">Sign in to get started.</Typography>

        <div>
          {authError && (
            <Typography variant="caption" className={classes.errorMessage}>
              <ErrorIcon />
              {authError.message}
            </Typography>
          )}
        </div>

        <Button
          fullWidth
          variant="contained"
          className={classes.button}
          onClick={login}
          startIcon={GoogleLogo}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Container>
  );
}
