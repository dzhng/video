import React from 'react';
import ParticipantTracks from '~/components/Video/ParticipantTracks/ParticipantTracks';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';
import ScreenShareParticipantInfo from './ScreenShareParticipantInfo/ScreenShareParticipantInfo';

export default function ScreenShareParticipant() {
  const screenShareParticipant = useScreenShareParticipant();

  return screenShareParticipant ? (
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
  ) : null;
}
