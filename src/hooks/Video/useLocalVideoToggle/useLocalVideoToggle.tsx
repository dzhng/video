import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useRef, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
    removeLocalVideoTrack,
    onError,
  } = useVideoContext();
  const videoTrack = localTracks.find((track) => track.name.includes('camera')) as LocalVideoTrack;
  const [isPublishing, setIsPublishing] = useState(false);
  const previousDeviceIdRef = useRef<string>();

  // TODO: useEffect, if localParticipant exist, publish existing videoTrack. If this isn't here, there'll be a bug where if you join a room, local participant won't publish anything unless if toggle is called

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      if (videoTrack) {
        previousDeviceIdRef.current = videoTrack.mediaStreamTrack.getSettings().deviceId;
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        removeLocalVideoTrack();
      } else {
        setIsPublishing(true);
        getLocalVideoTrack({ deviceId: { exact: previousDeviceIdRef.current } })
          .then((track: LocalVideoTrack) =>
            localParticipant?.publishTrack(track, { priority: 'low' }),
          )
          .catch(onError)
          .finally(() => setIsPublishing(false));
      }
    }
  }, [
    videoTrack,
    localParticipant,
    getLocalVideoTrack,
    isPublishing,
    onError,
    removeLocalVideoTrack,
  ]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
