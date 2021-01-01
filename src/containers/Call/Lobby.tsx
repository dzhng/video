import React, { useCallback, useEffect } from 'react';
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
  waitForJoin,
  isHost,
  call,
  endCall,
}: {
  waitForJoin: boolean;
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

  // we only want this to run once when call is ready
  useEffect(() => {
    if (call && !waitForJoin) {
      handleSubmit();
    }
  }, [call]); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: just put this inside of LocalPreview, since it's the same between this and CreateCall component. Can expose isLoading / disabled / onClick as props.
  const actionBar = (
    <Button
      className={classes.joinButton}
      onClick={handleSubmit}
      color="primary"
      variant="contained"
      disabled={isConnecting || isLoading || !waitForJoin}
      data-testid="join-button"
    >
      {isConnecting || !waitForJoin ? (
        <CircularProgress data-testid="progress-spinner" color="inherit" size={'1rem'} />
      ) : (
        'Join'
      )}
    </Button>
  );

  return <>{roomState !== 'connected' ? <LocalPreview actionBar={actionBar} /> : <Room />}</>;
}
