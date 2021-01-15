import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LocalVideoTrack } from 'twilio-video';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import Lobby from './Lobby';
import CreateCall from './CreateCall';
import WaitForHost from './WaitForHost';

export default function CallFlow({ isCallStarted }: { isCallStarted: boolean }) {
  const [mediaError, setMediaError] = useState<Error>();
  const {
    room,
    localTracks,
    getAudioAndVideoTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
  } = useVideoContext();
  const { isHost, createCall } = useCallContext();
  const cleanUpTracks = useRef<() => void>();

  // tracks if the call was created by user or if just joining existing call
  const [callCreated, setCallCreated] = useState(false);

  // get local tracks on component mount, remove when dismounted
  useEffect(() => {
    getAudioAndVideoTracks().catch((error) => {
      console.log('Error acquiring local media:');
      console.dir(error);
      setMediaError(error);
    });
  }, [getAudioAndVideoTracks]);

  // keep a latest up to date version of cleanup methods at all times, to call during unmount
  useEffect(() => {
    cleanUpTracks.current = async () => {
      console.log('Cleaning up local tracks...');

      // disconnect method may not exist since it may be stubed by EventEmitter in VideoContext
      room.disconnect?.();

      // unpublish before removing track to prevent chrome freezing
      const videoTrack = localTracks.find((track) =>
        track.name.includes('camera'),
      ) as LocalVideoTrack;
      room.localParticipant.unpublishTrack(videoTrack);

      removeLocalVideoTrack();
      removeLocalAudioTrack();
    };
  }, [removeLocalVideoTrack, removeLocalAudioTrack, room, localTracks]);

  // during unmount, cleanup tracks
  useEffect(() => () => cleanUpTracks.current?.(), []);

  const handleCreate = useCallback(() => {
    setCallCreated(true);
    return createCall();
  }, [createCall]);

  return (
    <>
      {isCallStarted ? (
        <Lobby waitForJoin={!callCreated} />
      ) : isHost ? (
        <CreateCall create={handleCreate} />
      ) : (
        <WaitForHost />
      )}
      <MediaErrorSnackbar error={mediaError} />
    </>
  );
}
