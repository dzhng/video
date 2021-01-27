import React, { useCallback } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import useScreenShareToggle from '~/hooks/Video/useScreenShareToggle/useScreenShareToggle';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'black',
      color: 'white',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[7],
      overflow: 'hidden',

      '& h1': {
        marginBottom: theme.spacing(3),
      },
    },
  }),
);

export default function LocalMessage() {
  const classes = useStyles();
  const [isScreenShared, toggleScreenShare] = useScreenShareToggle();

  const handleStop = useCallback(() => {
    if (isScreenShared) {
      toggleScreenShare();
    }
  }, [isScreenShared, toggleScreenShare]);

  return (
    <div className={classes.container}>
      <Typography variant="h1">You are currently sharing your screen.</Typography>
      <Button color="secondary" variant="contained" size="large" onClick={handleStop}>
        Stop sharing screen
      </Button>
    </div>
  );
}
