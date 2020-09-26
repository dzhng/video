import React, { ChangeEvent, useState, FormEvent } from 'react';
import { useAppState } from '../../state';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { ReactComponent as GoogleLogo } from './google-logo.svg';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import videoLogo from './video-logo.png';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#0D122B',
  },
  videoLogo: {
    width: '25%',
    padding: '2.4em 0 2.1em',
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

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

export default function LoginPage() {
  const classes = useStyles();
  const { signIn, user, isAuthReady } = useAppState();
  const history = useHistory();
  const location = useLocation<{ from: Location }>();
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<Error | null>(null);

  const login = () => {
    setAuthError(null);
    signIn?.(passcode)
      .then(() => {
        history.replace(location?.state?.from || { pathname: '/' });
      })
      .catch(err => setAuthError(err));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  if (user) {
    history.replace('/');
  }

  if (!isAuthReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" className={classes.container}>
        <Paper className={classes.paper} elevation={6}>
          <img className={classes.videoLogo} src={videoLogo} alt="Video Logo"></img>

          <Button variant="contained" className={classes.button} onClick={login} startIcon={<GoogleLogo />}>
            Sign in with Google
          </Button>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
