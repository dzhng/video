import { useEffect, useCallback, useState } from 'react';
import { isMobile } from '~/utils';
import useVideoContext from '../useVideoContext/useVideoContext';

// video is a bit more complicated than audio, because we need to completely stop
// video track instead of just disabling, or else the camera light will be on
export default function useLocalVideoToggle() {
  const {
    room: { localParticipant },
    localTracks,
    onError,
  } = useVideoContext();
  const videoTrack = localTracks.find((track) => track.name.includes('camera'));
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // everytime video track changes, set a new enabled flag
  useEffect(() => {
    if (videoTrack) {
      setIsEnabled(true);
    }
  }, [videoTrack]);

  // tracks if currently publishing track, ignore toggle if it is still publishing
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleVideoEnabled = useCallback(() => {
    if (isPublishing || !videoTrack) {
      return;
    }

    // for mobile - Android chrome has a bug where it freeze when track is stopped,
    // so enable/disable instead. Also makes it less resource intensive.
    if (isMobile) {
      isEnabled ? videoTrack.disable() : videoTrack.enable();
      setIsEnabled(!isEnabled);
    } else {
      if (isEnabled) {
        videoTrack.stop();
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        setIsEnabled(false);
      } else {
        setIsPublishing(true);
        videoTrack
          .restart()
          .then(() => localParticipant?.publishTrack(videoTrack, { priority: 'low' }))
          .then(() => setIsEnabled(true))
          .catch(onError)
          .finally(() => setIsPublishing(false));
      }
    }
  }, [isEnabled, videoTrack, localParticipant, isPublishing, onError]);

  return [isEnabled, toggleVideoEnabled] as const;
}
