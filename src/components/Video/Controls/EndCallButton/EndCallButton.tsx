import React, { useCallback, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
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
import { useStyles } from '../styles';

export default function EndCallButton({
  setPopperMessage,
}: {
  setPopperMessage(node: React.ReactNode, autoClose?: boolean): void;
}) {
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

  useHotkeys(
    'e',
    (e) => {
      e.preventDefault();
      handleEndCall();
      // only show message if not host since host has the confirm dialog
      !isHost && setPopperMessage(<b>Ending call...</b>, true);
    },
    [isHost, setPopperMessage],
  );

  return (
    <>
      <Tooltip
        title={'End Call [E]'}
        onClick={handleEndCall}
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        <div>
          <Fab className={classes.fab} color="secondary" disabled={isEndingCall}>
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
