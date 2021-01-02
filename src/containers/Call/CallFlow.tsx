import React, { useState, useEffect, useCallback, useRef } from 'react';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import Lobby from './Lobby';
import CreateCall from './CreateCall';
import WaitForHost from './WaitForHost';

export default function CallFlow({
  isCallStarted,
  createCall,
}: {
  isCallStarted: boolean;
  createCall(): Promise<boolean>;
}) {
  const [mediaError, setMediaError] = useState<Error>();
  const {
    room,
    getAudioAndVideoTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
  } = useVideoContext();
  const { isHost, call } = useCallContext();
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
    cleanUpTracks.current = () => {
      console.log('Cleaning up local tracks...');

      // disconnect could not exist since it may be stubed by EventEmitter in VideoContext
      room.disconnect?.();

      removeLocalVideoTrack();
      removeLocalAudioTrack();
    };
  }, [removeLocalVideoTrack, removeLocalAudioTrack, room]);

  // during unmount, cleanup tracks
  useEffect(() => () => cleanUpTracks.current?.(), []);

  const handleCreate = useCallback(() => {
    setCallCreated(true);
    return createCall();
  }, [createCall]);

  return (
    <>
      {isCallStarted ? (
        <Lobby waitForJoin={!callCreated} isHost={isHost} call={call} />
      ) : isHost ? (
        <CreateCall create={handleCreate} />
      ) : (
        <WaitForHost />
      )}
      <MediaErrorSnackbar error={mediaError} />
    </>
  );
}
