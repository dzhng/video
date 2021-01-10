import React, { useCallback, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import {
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useCallContext from '~/hooks/useCallContext/useCallContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  }),
);

export default function EndCallButton(props: object) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { isHost, endCall } = useCallContext();
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEndCall = useCallback(() => {
    if (isHost) {
      setConfirmOpen(true);
    } else {
      room.disconnect();
    }
  }, [isHost, room]);

  const handleConfirm = useCallback(async () => {
    setIsEndingCall(true);
    await endCall().catch(() => setIsEndingCall(false));
    room.disconnect();
  }, [endCall, room]);

  return (
    <>
      <Tooltip
        title={'End Call'}
        onClick={handleEndCall}
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        <div>
          <Fab className={classes.fab} color="secondary" disabled={isEndingCall} {...props}>
            <CallEnd />
          </Fab>
        </div>
      </Tooltip>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>End Call?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            As the host, leaving the call will end the call for everyone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
            End Call
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
