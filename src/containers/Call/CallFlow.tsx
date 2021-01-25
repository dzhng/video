import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LocalVideoTrack } from 'twilio-video';
import { styled } from '@material-ui/core/styles';

import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import TipsSnackBar from './TipsSnackBar/TipsSnackBar';
import ActivityDrawer from './ActivityDrawer';
import Lobby from './Lobby';
import CreateCall from './CreateCall';
import WaitForHost from './WaitForHost';

const Container = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',

  '& #main': {
    flexGrow: 1,
    // used to position snackbar
    position: 'relative',
  },
});

export default function CallFlow({
  isCallStarted,
  fromHref,
}: {
  isCallStarted: boolean;
  fromHref?: string;
}) {
  const [mediaError, setMediaError] = useState<Error>();
  const {
    room,
    localTracks,
    getAudioAndVideoTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
  } = useVideoContext();
  const roomState = useRoomState();
  const { isHost, createCall } = useCallContext();
  const cleanUpTracks = useRef<() => void>();

  // tracks if the call was created by user or if just joining existing call
  const [callCreated, setCallCreated] = useState(false);

  // get local tracks on component mount
  useEffect(() => {
    getAudioAndVideoTracks().catch((error) => {
      console.log('Error acquiring local media:');
      console.dir(error);
      setMediaError(error);
    });
  }, [getAudioAndVideoTracks]);

  // keep a latest up to date version of cleanup methods at all times, to call during unmount
  useEffect(() => {
    cleanUpTracks.current = () => {
      console.log('Cleaning up local tracks...');

      // unpublish before removing track to prevent chrome freezing on android:
      // https://github.com/twilio/twilio-video-app-react/issues/355
      const videoTrack = localTracks.find((track) =>
        track.name.includes('camera'),
      ) as LocalVideoTrack;

      if (videoTrack) {
        videoTrack.disable();
        room.localParticipant?.unpublishTrack(videoTrack);
      }

      removeLocalVideoTrack();
      removeLocalAudioTrack();

      // disconnect method may not exist since it may be stubed by EventEmitter in VideoContext
      room.disconnect?.();
    };
  }, [removeLocalVideoTrack, removeLocalAudioTrack, room, localTracks]);

  // during unmount, cleanup tracks
  useEffect(() => () => cleanUpTracks.current?.(), []);

  const handleCreate = useCallback(() => {
    setCallCreated(true);
    return createCall();
  }, [createCall]);

  return (
    <Container>
      {roomState === 'connected' && (
        <ActivityDrawer isCallStarted={isCallStarted} fromHref={fromHref} />
      )}

      <div id="main">
        {isCallStarted ? (
          <Lobby waitForJoin={!callCreated} />
        ) : isHost ? (
          <CreateCall create={handleCreate} />
        ) : (
          <WaitForHost />
        )}

        <TipsSnackBar />
      </div>

      <MediaErrorSnackbar error={mediaError} />
    </Container>
  );
}
