import React from 'react';
import ParticipantTracks from '~/components/Video/ParticipantTracks/ParticipantTracks';
import useMainParticipant from '~/hooks/Video/useMainParticipant/useMainParticipant';
import MainParticipantInfo from './MainParticipantInfo/MainParticipantInfo';

export default function MainParticipant() {
  const { mainParticipant, videoPriority } = useMainParticipant();

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks
        participant={mainParticipant}
        disableAudio
        enableScreenShare
        videoPriority={videoPriority}
      />
    </MainParticipantInfo>
  );
}
