import React, { useState, useCallback, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppState } from '~/state';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import Room from '~/components/Video/Room/Room';
import LocalPreview from './LocalPreview';
import WaitForSummary from './WaitForSummary';

export default function CallLobby({ waitForJoin }: { waitForJoin: boolean }) {
  const { getToken, isFetching } = useAppState();
  const { isConnecting: _isConnecting, connect, isAcquiringLocalTracks } = useVideoContext();
  const { call } = useCallContext();
  const roomState = useRoomState();
  const [hasConnected, setHasConnected] = useState(false);

  const isLoading = !call || isAcquiringLocalTracks;
  const isConnecting = isFetching || _isConnecting;

  const handleSubmit = useCallback(async () => {
    if (!call || isConnecting || roomState !== 'disconnected') {
      return;
    }

    const token = await getToken(call.id);
    if (token) {
      connect(token).then(() => setHasConnected(true));
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

  useHotkeys(
    'enter',
    (e) => {
      // make sure to have this check because we want
      // the enter key for modal confirmations... etc, so
      // don't want to prevent default all the time
      if (roomState !== 'connected') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [roomState, handleSubmit],
  );

  return roomState === 'disconnected' ? (
    hasConnected ? (
      <WaitForSummary />
    ) : (
      <LocalPreview
        title="Prepare to join call"
        helperText="Please check that your camera and mic is enabled, and join the call when you are ready."
        actionText="Join Call"
        disabled={isConnecting || isLoading || !waitForJoin}
        isSubmitting={isConnecting || !waitForJoin}
        onSubmit={handleSubmit}
      />
    )
  ) : (
    <Room />
  );
}
