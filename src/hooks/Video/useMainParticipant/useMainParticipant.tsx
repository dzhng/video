import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';

export default function useMainParticipant() {
  const screenShareParticipant = useScreenShareParticipant();
  const {
    room: { localParticipant },
  } = useVideoContext();

  const remoteScreenShareParticipant =
    screenShareParticipant !== localParticipant ? screenShareParticipant : null;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  const mainParticipant = remoteScreenShareParticipant || localParticipant;
  const videoPriority: 'high' | null = mainParticipant === screenShareParticipant ? 'high' : null;

  return {
    mainParticipant,
    videoPriority,
  };
}
