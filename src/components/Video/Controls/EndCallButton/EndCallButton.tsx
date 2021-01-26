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
    setConfirmOpen(true);
  }, []);

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
      setPopperMessage(<b>Ending call...</b>, true);
    },
    [handleEndCall, setPopperMessage],
  );

  return (
    <>
      <Tooltip
        title={'End Call [E]'}
        onClick={isHost ? handleEndCall : handleConfirm}
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
            {isHost
              ? 'As the host, leaving the call will end the call for everyone.'
              : 'Are you sure you want to leave this call? You can rejoin by returning to this link.'}
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
