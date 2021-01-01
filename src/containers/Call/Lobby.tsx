import React, { useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import { useAppState } from '~/state';
import { LocalModel, Call } from '~/firebase/schema-types';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import Room from '~/components/Video/Room/Room';
import LocalPreview from './LocalPreview';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinButton: {
      height: 50,
      borderRadius: 0,

      '& div[role=progressbar]': {
        marginRight: theme.spacing(1),
      },
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
  const { isConnecting: _isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();

  const isLoading = !call || isAcquiringLocalTracks;
  const isConnecting = isFetching || _isConnecting;

  const handleSubmit = useCallback(() => {
    if (!call || isConnecting) {
      return;
    }

    getToken(call.id).then((token) => connect(token));
  }, [call, getToken, connect, isConnecting]);

  const actionBar = (
    <Button
      className={classes.joinButton}
      onClick={handleSubmit}
      color="primary"
      variant="contained"
      disabled={isConnecting || isLoading}
      data-testid="join-button"
    >
      {isConnecting ? <CircularProgress data-testid="progress-spinner" color="inherit" /> : 'Join'}
    </Button>
  );

  return <>{roomState !== 'connected' ? <LocalPreview actionBar={actionBar} /> : <Room />}</>;
}
