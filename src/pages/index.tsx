import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Typography, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAppState } from '~/state';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      maxWidth: 200,
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
  }),
);

export default function IndexPage() {
  const router = useRouter();
  const { user, isAuthReady } = useAppState();
  const classes = useStyles();
  const [roomName, setRoomName] = useState<string>('');

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push('/login');
    }
  }, [isAuthReady]); // eslint-disable-line

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(encodeURI(`/room/${roomName}`));
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography className={classes.displayName} variant="body1">
        Enter Room Name:
      </Typography>
      <TextField
        id="menu-room"
        label="Room"
        className={classes.textField}
        value={roomName}
        onChange={handleRoomNameChange}
        margin="dense"
      />
      <Button
        className={classes.joinButton}
        type="submit"
        color="primary"
        variant="contained"
        disabled={!roomName}
        data-testid="join-button"
      >
        Join Room
      </Button>
    </form>
  );
}
