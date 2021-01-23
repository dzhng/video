import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useDominantSpeaker() {
  const { room } = useVideoContext();
  const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker);

  useEffect(() => {
    const handleDominantSpeakerChanged = (newDominantSpeaker: RemoteParticipant) => {
      setDominantSpeaker(newDominantSpeaker);
    };

    const handleParticipantDisconnected = (participant: RemoteParticipant) => {
      setDominantSpeaker((prevDominantSpeaker) => {
        return prevDominantSpeaker === participant ? null : prevDominantSpeaker;
      });
    };

    room.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
    room.on('participantDisconnected', handleParticipantDisconnected);
    return () => {
      room.off('dominantSpeakerChanged', handleDominantSpeakerChanged);
      room.off('participantDisconnected', handleParticipantDisconnected);
    };
  }, [room]);

  return dominantSpeaker;
}
