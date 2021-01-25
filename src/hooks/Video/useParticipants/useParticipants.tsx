import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useParticipants() {
  const { room } = useVideoContext();
  const [participants, setParticipants] = useState(Array.from(room.participants.values()));

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) =>
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    const participantDisconnected = (participant: RemoteParticipant) =>
      setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant));
    // this method create a new participants array with the same data, this way the data will change even for events like track publications
    const refreshParticipants = () => setParticipants((prevParticipants) => [...prevParticipants]);

    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    room.on('trackPublished', refreshParticipants);
    room.on('trackUnpublished', refreshParticipants);

    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
      room.off('trackPublished', refreshParticipants);
      room.off('trackUnpublished', refreshParticipants);
    };
  }, [room]);

  return participants;
}
