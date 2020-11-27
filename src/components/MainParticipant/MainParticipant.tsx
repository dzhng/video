import React from 'react';
import ParticipantTracks from '~/components/ParticipantTracks/ParticipantTracks';
import useSelectedParticipant from '~/components/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useMainParticipant from '~/hooks/useMainParticipant/useMainParticipant';
import useScreenShareParticipant from '~/hooks/useScreenShareParticipant/useScreenShareParticipant';
import MainParticipantInfo from './MainParticipantInfo/MainParticipantInfo';

export default function MainParticipant() {
  const mainParticipant = useMainParticipant();
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant
      ? 'high'
      : null;

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
