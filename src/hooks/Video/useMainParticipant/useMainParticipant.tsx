import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useDominantSpeaker from '~/hooks/Video/useDominantSpeaker/useDominantSpeaker';
import useParticipants from '~/hooks/Video/useParticipants/useParticipants';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';

export default function useMainParticipant() {
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const dominantSpeaker = useDominantSpeaker();
  const participants = useParticipants();
  const {
    room: { localParticipant },
  } = useVideoContext();

  const remoteScreenShareParticipant =
    screenShareParticipant !== localParticipant ? screenShareParticipant : null;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  return (
    selectedParticipant ||
    remoteScreenShareParticipant ||
    dominantSpeaker ||
    participants[0] ||
    localParticipant
  );
}
