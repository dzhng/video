import React, { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';

import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import '~/types';
import { useAppState } from '~/state';
import ErrorDialog from '~/components/ErrorDialog/ErrorDialog';
import { VideoProvider } from '~/components/VideoProvider';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Room from '~/components/Room/Room';

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

  const { slug } = router.query;
  const roomName: string = String(slug);

  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    getToken(roomName).then((token) => connect(token));
  };

  return (
    <>
      <Room />
      <Button
        className={classes.joinButton}
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        disabled={isAcquiringLocalTracks || isConnecting || !roomName || isFetching}
        data-testid="join-button"
      >
        Join Call
      </Button>
      {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
    </>
  );
}

export default withPrivateRoute(function RoomPage() {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <Lobby />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
});
