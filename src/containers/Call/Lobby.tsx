import React, { useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import { useAppState } from '~/state';
import { LocalModel, Call } from '~/firebase/schema-types';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import Room from '~/components/Video/Room/Room';

const useStyles = makeStyles(() =>
  createStyles({
    loadingSpinner: {
      marginLeft: '1em',
    },
    joinButton: {
      margin: '1em',
    },
  }),
);

export default function CallLobby({
  isHost,
  call,
  endCall,
}: {
  isHost: boolean;
  call?: LocalModel<Call>;
  endCall(): void;
}) {
  const classes = useStyles();
  const { getToken, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();

  const handleSubmit = useCallback(() => {
    if (!call) {
      return;
    }

    getToken(call.id).then((token) => connect(token));
  }, [call, getToken, connect]);

  return (
    <>
      <Room />
      {roomState !== 'connected' && call && (
        <Button
          className={classes.joinButton}
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isAcquiringLocalTracks || isConnecting || isFetching}
          data-testid="join-button"
        >
          Join Call
        </Button>
      )}
      {(isConnecting || isFetching) && (
        <CircularProgress className={classes.loadingSpinner} data-testid="progress-spinner" />
      )}
    </>
  );
}
