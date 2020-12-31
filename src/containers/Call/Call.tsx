import React, { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';

import { Call, Template } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import ErrorDialog from '~/components/Video/ErrorDialog/ErrorDialog';
import { VideoProvider } from '~/components/Video/VideoProvider';
import Room from '~/components/Video/Room/Room';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

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

function Lobby() {
  const classes = useStyles();
  const router = useRouter();
  const { getToken, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const roomState = useRoomState();

  const { slug } = router.query;
  const roomName: string = String(slug);

  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    getToken(roomName).then((token) => connect(token));
  };

  return (
    <>
      <Room />
      {roomState !== 'connected' && (
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

export default function CallContainer({
  template,
  call,
  createCall,
  endCall,
}: {
  template: Template;
  call?: Call;
  createCall(): Promise<boolean>;
  endCall(): void;
}) {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <Lobby />
        {JSON.stringify(call)}
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
}
