import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  Button,
  TextField,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useAppState } from '~/state';

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      marginTop: 'calc(50vh - 150px)',
      padding: theme.spacing(3),

      '& h1': {
        marginBottom: theme.spacing(2),
        textAlign: 'center',
      },
      '& hr': {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
      },
    },
    joinButton: {
      height: 42,
    },
    googleButton: {
      color: 'black',
      background: 'white',
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
  }),
);

const GoogleLogo = <img src="/google-logo.svg" />;

export default function GuestSignin() {
  const classes = useStyles();
  const { signIn, signInAnonymously } = useAppState();
  const [authError, setAuthError] = useState<Error | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const loginWithGoogle = useCallback(() => {
    setAuthError(null);
    setIsAuthenticating(true);
    signIn().catch((err) => {
      setAuthError(err);
      setIsAuthenticating(false);
    });
  }, [signIn]);

  const loginAnonymously = useCallback(() => {
    setAuthError(null);
    setIsAuthenticating(true);
    signInAnonymously()
      .then((user) => {
        return user?.updateProfile({ displayName });
      })
      .catch((err) => {
        setAuthError(err);
        setIsAuthenticating(false);
      });
  }, [signInAnonymously, displayName]);

  return (
    <Container maxWidth="xs" style={{ height: '100vh' }}>
      <Card className={classes.card}>
        <Typography variant="h1">Welcome to Aomni</Typography>

        <div>
          {authError && (
            <Typography variant="caption" className={classes.errorMessage}>
              <ErrorOutlineIcon />
              {authError.message}
            </Typography>
          )}
        </div>

        <Typography variant="body1">
          Please enter your name so other participants can identify you in the call. Or, sign in
          with Google to use your Google account.
        </Typography>
        <TextField
          fullWidth
          className={classes.joinButton}
          variant="outlined"
          margin="normal"
          placeholder="What is your name?"
          disabled={isAuthenticating}
          value={displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
        />
        <Button
          fullWidth
          disabled={isAuthenticating}
          variant="contained"
          color="primary"
          onClick={loginAnonymously}
        >
          {isAuthenticating ? <CircularProgress size={'1.5rem'} /> : 'Join Call'}
        </Button>

        <Divider />

        <Button
          fullWidth
          disabled={isAuthenticating}
          variant="contained"
          className={classes.googleButton}
          onClick={loginWithGoogle}
          startIcon={GoogleLogo}
        >
          Sign in with Google
        </Button>
      </Card>
    </Container>
  );
}
