import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import {
  Typography,
  Button,
  Paper,
  Container,
  FormControl,
  Input,
  InputLabel,
} from '@material-ui/core';

import { useAppState } from '~/state';
import LoadingContainer from '~/containers/Loading/Loading';

const GoogleLogo = <img src="/google-logo.svg" />;

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

export default function LoginPage({ previousPage }: { previousPage?: string }) {
  const classes = useStyles();
  const router = useRouter();
  const { signInWithEmailAndPassword, isAuthReady, signInWithGoogle } = useAppState();
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    setAuthError(null);
    setIsAuthenticating(true);
    signInWithEmailAndPassword(email, password)
      .then(() => {
        router.replace(previousPage ?? '/');
      })
      .catch((err) => {
        setAuthError(err);
        setIsAuthenticating(false);
      });
  };

  const loginWithGoogle = useCallback(() => {
    setAuthError(null);
    setIsAuthenticating(true);
    signInWithGoogle()
      .then(() => {
        router.replace(previousPage ?? '/');
      })
      .catch((err) => {
        setAuthError(err);
        setIsAuthenticating(false);
      });
  }, [previousPage, router, signInWithGoogle]);

  if (!isAuthReady) {
    return <LoadingContainer />;
  }

  return (
    <Container maxWidth="xs" className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h1">Welcome to Aomni</Typography>
        <Typography variant="body1">Login to get started.</Typography>

        {authError && (
          <Typography variant="caption" className={classes.errorMessage}>
            <ErrorIcon />
            {authError.message}
          </Typography>
        )}

        <Button
          fullWidth
          disabled={isAuthenticating}
          variant="contained"
          className={classes.button}
          onClick={loginWithGoogle}
          startIcon={GoogleLogo}
        >
          Sign in with Google
        </Button>

        <FormControl>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input
            id="email"
            aria-describedby="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <br />

        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type="password"
            id="password"
            aria-describedby="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <br />
        <br />
        <Button variant="contained" disabled={isAuthenticating} color="primary" onClick={login}>
          Login
        </Button>
      </Paper>
    </Container>
  );
}
