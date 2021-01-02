import React, { useState, useEffect, useCallback } from 'react';
import { LocalModel, Call } from '~/firebase/schema-types';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import Lobby from './Lobby';
import CreateCall from './CreateCall';
import WaitForHost from './WaitForHost';

export default function CallFlow({
  isCallStarted,
  isHost,
  call,
  createCall,
}: {
  isCallStarted: boolean;
  isHost: boolean;
  call?: LocalModel<Call>;
  createCall(): Promise<boolean>;
}) {
  const [mediaError, setMediaError] = useState<Error>();
  const { getAudioAndVideoTracks } = useVideoContext();

  // tracks if the call was created by user or if just joining existing call
  const [callCreated, setCallCreated] = useState(false);

  useEffect(() => {
    getAudioAndVideoTracks().catch((error) => {
      console.log('Error acquiring local media:');
      console.dir(error);
      setMediaError(error);
    });
  }, [getAudioAndVideoTracks]);

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
