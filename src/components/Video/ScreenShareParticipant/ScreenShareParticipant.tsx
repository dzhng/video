import React from 'react';
import ParticipantTracks from '~/components/Video/ParticipantTracks/ParticipantTracks';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';
import ScreenShareParticipantInfo from './ScreenShareParticipantInfo/ScreenShareParticipantInfo';
import LocalMessage from './LocalMessage';

export default function ScreenShareParticipant() {
  const { room } = useVideoContext();
  const screenShareParticipant = useScreenShareParticipant();
  const isLocal = screenShareParticipant === room.localParticipant;

  // if participant is local, just show a message instead,
  // or else if the sharer views this screen it'll create
  // an infinite mirror effect
  return screenShareParticipant ? (
    isLocal ? (
      <LocalMessage />
    ) : (
      /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
      <ScreenShareParticipantInfo participant={screenShareParticipant}>
        <ParticipantTracks
          participant={screenShareParticipant}
          disableAudio
          enableScreenShare
          videoPriority="high"
        />
      </ScreenShareParticipantInfo>
    )
  ) : null;
}
