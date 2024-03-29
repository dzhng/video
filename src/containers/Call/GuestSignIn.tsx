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
import { Logo } from '~/components/Icons';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      padding: theme.spacing(3),
      textAlign: 'center',

      '& hr': {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
      },
    },
    logo: {
      marginBottom: theme.spacing(1),
      maxWidth: 120,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    joinButton: {
      marginTop: theme.spacing(1),
      height: 42,
    },
    googleButton: {
      fontSize: '1.1rem',
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
  const { signInWithGoogle, signInAnonymously } = useAppState();
  const [authError, setAuthError] = useState<Error | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const loginWithGoogle = useCallback(() => {
    setAuthError(null);
    setIsAuthenticating(true);
    signInWithGoogle().catch((err) => {
      setAuthError(err);
      setIsAuthenticating(false);
    });
  }, [signInWithGoogle]);

  const loginAnonymously = useCallback(() => {
    setAuthError(null);
    setIsAuthenticating(true);
    const finalDisplayName = displayName ?? 'Aomni Customer';

    signInAnonymously(finalDisplayName).catch((err) => {
      setAuthError(err);
      setIsAuthenticating(false);
    });
  }, [signInAnonymously, displayName]);

  return (
    <Container maxWidth="xs" className={classes.container}>
      <Card className={classes.card}>
        <Logo className={classes.logo} />

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
          variant="outlined"
          margin="normal"
          placeholder="What is your name?"
          disabled={isAuthenticating}
          value={displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
          inputProps={{
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && loginAnonymously(),
          }}
        />
        <Button
          fullWidth
          className={classes.joinButton}
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
          variant="outlined"
          color="primary"
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
