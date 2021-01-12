import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const {
    room: { localParticipant },
    localTracks,
    onError,
  } = useVideoContext();
  const videoTrack = localTracks.find((track) => track.name.includes('camera'));

  // tracks if currently publishing track, ignore toggle if it is still publishing
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleVideoEnabled = useCallback(() => {
    if (isPublishing || !videoTrack) {
      return;
    }

    if (videoTrack.isStopped) {
      setIsPublishing(true);
      videoTrack.restart();
      localParticipant
        ?.publishTrack(videoTrack, { priority: 'low' })
        .catch(onError)
        .finally(() => setIsPublishing(false));
    } else {
      videoTrack.stop();
      const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant?.emit('trackUnpublished', localTrackPublication);
    }
  }, [videoTrack, localParticipant, isPublishing, onError]);

  return [videoTrack ? !videoTrack.isStopped : false, toggleVideoEnabled] as const;
}
