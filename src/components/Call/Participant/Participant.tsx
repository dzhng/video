import React from 'react';
import { Participant as IParticipant } from 'twilio-video';
import ParticipantTracks from '~/components/Call/ParticipantTracks/ParticipantTracks';
import ParticipantInfo from './ParticipantInfo/ParticipantInfo';

interface ParticipantProps {
  participant: IParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  isSelected: boolean;
}

export default function Participant({
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  isSelected,
}: ParticipantProps) {
  return (
    <ParticipantInfo participant={participant} onClick={onClick} isSelected={isSelected}>
      <ParticipantTracks
        participant={participant}
        disableAudio={disableAudio}
        enableScreenShare={enableScreenShare}
      />
    </ParticipantInfo>
  );
}
