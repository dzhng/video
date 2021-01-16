import {
  makeStyles,
  createStyles,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
} from '@material-ui/core';
import { ErrorOutline as ErrorIcon } from '@material-ui/icons';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '~/utils/firebase';
import { Collections, User } from '~/firebase/schema-types';

import { useAppState } from '~/state';

const useStyles = makeStyles(() =>
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

export default function RegisterPage({ previousPage }: { previousPage?: string }) {
  const router = useRouter();
  const classes = useStyles();

  const { register } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = () => {
    setAuthError(null);
    setIsAuthenticating(true);
    register(email, password, name)
      .then((user) => {
        if (user) {
          const userData: User = {
            displayName: user.displayName ?? name ?? 'Aomni Customer',
          };
          db.collection(Collections.USERS).doc(user.uid).set(userData);
        }
        router.replace(previousPage ?? '/');
      })
      .catch((errMsg) => {
        setAuthError(errMsg);
        setIsAuthenticating(false);
      });
  };

  return (
    <Container maxWidth="xs" className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h1">Welcome to Aomni</Typography>
        <Typography variant="body1">Register to get started.</Typography>

        <FormControl>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            aria-describedby="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <br />

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
        {authError && (
          <Typography variant="caption" className={classes.errorMessage}>
            <ErrorIcon />
            {authError.message}
          </Typography>
        )}
        <br />
        <Button
          variant="contained"
          disabled={isAuthenticating}
          color="primary"
          onClick={handleSubmit}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}
