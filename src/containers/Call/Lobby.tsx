import React, { useCallback, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import { useAppState } from '~/state';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import Room from '~/components/Video/Room/Room';
import LocalPreview from './LocalPreview';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinButton: {
      height: 50,
      borderRadius: 0,
      flexShrink: 0,
      fontWeight: 'bold',
      fontSize: '1.1rem',
      ...theme.customMixins.callButton,

      '& div[role=progressbar]': {
        marginRight: theme.spacing(1),
      },
    },
  }),
);

export default function CallLobby({ waitForJoin }: { waitForJoin: boolean }) {
  const classes = useStyles();
  const { getToken, isFetching } = useAppState();
  const { isConnecting: _isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const { call } = useCallContext();
  const roomState = useRoomState();

  const isLoading = !call || isAcquiringLocalTracks;
  const isConnecting = isFetching || _isConnecting;

  const handleSubmit = useCallback(async () => {
    if (!call || isConnecting || roomState !== 'disconnected') {
      return;
    }

    const token = await getToken(call.id);
    if (token) {
      connect(token);
    } else {
      console.error('Token not defined');
    }
  }, [call, getToken, connect, isConnecting, roomState]);

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
        'Join Call'
      )}
    </Button>
  );

  return <>{roomState !== 'connected' ? <LocalPreview actionBar={actionBar} /> : <Room />}</>;
}
