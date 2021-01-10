import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { useAppState } from '~/state';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#0D122B',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: '460px',
    padding: '2em',
    marginTop: '4em',
    background: 'white',
    color: 'black',
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
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
});

const GoogleLogo = <img src="/google-logo.svg" />;

export default function LoginPage({ previousPage }: { previousPage?: string }) {
  const classes = useStyles();
  const router = useRouter();
  const { signIn, user, isAuthReady } = useAppState();
  const [authError, setAuthError] = useState<Error | null>(null);

  const login = useCallback(() => {
    setAuthError(null);
    signIn()
      .then(() => {
        router.replace(previousPage ?? '/');
      })
      .catch((err) => setAuthError(err));
  }, [previousPage, router, signIn]);

  if (user) {
    router.replace('/');
  }

  if (!isAuthReady) {
    return null;
  }

  return (
    <Grid
      container
      justify="center"
      alignItems="flex-start"
      className={classes.container}
      data-testid="container"
    >
      <Paper className={classes.paper} elevation={6}>
        <div>
          {authError && (
            <Typography variant="caption" className={classes.errorMessage}>
              <ErrorOutlineIcon />
              {authError.message}
            </Typography>
          )}
        </div>
        <Button
          variant="contained"
          className={classes.button}
          onClick={login}
          startIcon={GoogleLogo}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Grid>
  );
}
