import { useState, useEffect, useMemo } from 'react';
import { Participant } from 'twilio-video';
import { take, uniq, compact, intersection, without } from 'lodash';
import { maxTracks } from '~/constants';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useParticipants from '~/hooks/Video/useParticipants/useParticipants';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useDominantSpeaker from '~/hooks/Video/useDominantSpeaker/useDominantSpeaker';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';

// return if input participant have a video track
const haveVideo = (participant: Participant): boolean => {
  return Array.from(participant.videoTracks.values()).length > 0;
};

export default function useDisplayableParticipants(maxParticipants?: number) {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const screenShareParticipant = useScreenShareParticipant();
  const [selectedParticipant] = useSelectedParticipant();
  const participants = useParticipants();

  const [previousDominantSpeakers, setPreviousDominantSpeakers] = useState([dominantSpeaker]);

  // when displaying, make sure the person who was the last dominant speaker
  // is always shown, even if they are not the dominant speaker anymore
  useEffect(() => {
    if (dominantSpeaker) {
      // When the dominant speaker changes, they are moved to the front of the participants array.
      // This means that the most recent dominant speakers will always be near the top of the
      // ParticipantStrip component.
      setPreviousDominantSpeakers((state) => uniq([dominantSpeaker, ...state]));
    }
  }, [dominantSpeaker]);

  // when the participants list changes, make sure they are removed from this dominant
  // speaker array
  useEffect(() => {
    setPreviousDominantSpeakers((speakers) => intersection(speakers, participants));
  }, [participants]);

  const displayableParticipants = useMemo<Participant[]>(() => {
    const participantsWithVideo = participants.filter(haveVideo);

    return take(
      uniq(
        compact([
          // local participant always go first
          localParticipant,
          // selected participant is always front right after local
          selectedParticipant,
          // make sure screenshare participant is in front as well
          screenShareParticipant,
          ...previousDominantSpeakers,
          ...participantsWithVideo,
          ...participants,
        ]),
      ),
      maxParticipants ? Math.min(maxParticipants, maxTracks) : maxTracks,
    );
  }, [
    localParticipant,
    selectedParticipant,
    screenShareParticipant,
    previousDominantSpeakers,
    participants,
    maxParticipants,
  ]);

  const undisplayedParticipants = useMemo<Participant[]>(() => {
    return without(participants, ...displayableParticipants);
  }, [participants, displayableParticipants]);

  return [displayableParticipants, undisplayedParticipants];
}
