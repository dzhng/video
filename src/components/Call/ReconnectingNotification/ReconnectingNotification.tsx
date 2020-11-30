import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';

import useRoomState from '~/hooks/Call/useRoomState/useRoomState';

const useStyles = makeStyles({
  snackbar: {
    backgroundColor: '#6db1ff',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.8em',
  },
});

export default function ReconnectingNotification() {
  const classes = useStyles();
  const roomState = useRoomState();

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={roomState === 'reconnecting'}
      data-testid="container"
    >
      <SnackbarContent
        className={classes.snackbar}
        message={
          <span className={classes.message}>
            <InfoIcon className={classes.icon} />
            Reconnecting&hellip;
          </span>
        }
      />
    </Snackbar>
  );
}
