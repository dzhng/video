import { useEffect, useCallback, useState } from 'react';
import { Room, LocalVideoTrack, LocalAudioTrack, TwilioError } from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS } from '~/constants';
import { isMobile } from '~/utils';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';

// video is a bit more complicated than audio, because we need to completely stop
// video track instead of just disabling, or else the camera light will be on
export default function useLocalVideoToggle(
  room: Room,
  localTracks: (LocalVideoTrack | LocalAudioTrack)[],
  videoDevices: MediaDeviceInfo[],
  onError: (error: TwilioError) => void,
) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [supportsFacingMode, setSupportsFacingMode] = useState<Boolean | null>(null);

  const videoTrack = localTracks.find((track) => track.name.includes('camera'));
  const mediaStreamTrack = useMediaStreamTrack(videoTrack);

  const { localParticipant } = room;

  // everytime video track changes, set a new enabled flag
  useEffect(() => {
    if (videoTrack) {
      setIsEnabled(isMobile ? videoTrack.isEnabled : !videoTrack.isStopped);
    }
  }, [videoTrack]);

  useEffect(() => {
    // The 'supportsFacingMode' variable determines if this component is rendered
    // If 'facingMode' exists, we will set supportsFacingMode to true.
    // However, if facingMode is ever undefined again (when the user unpublishes video), we
    // won't set 'supportsFacingMode' to false. This prevents the icon from briefly
    // disappearing when the user switches their front/rear camera.
    const currentFacingMode = mediaStreamTrack?.getSettings().facingMode;
    if (currentFacingMode && supportsFacingMode === null) {
      setSupportsFacingMode(true);
    }
  }, [mediaStreamTrack, supportsFacingMode]);

  // tracks if currently publishing track, ignore toggle if it is still publishing
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleVideoEnabled = useCallback(async () => {
    if (isPublishing || !videoTrack) {
      return;
    }

    // NOTE: for mobile - Android chrome has a bug where it freeze when track is stopped,
    // so enable/disable instead. Also makes it less resource intensive.
    try {
      if (isEnabled) {
        isMobile ? videoTrack.disable() : videoTrack.stop();

        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove trackUnpublished emit when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        setIsEnabled(false);
      } else {
        setIsPublishing(true);

        await (isMobile ? Promise.resolve(videoTrack.enable()) : videoTrack.restart());
        await localParticipant?.publishTrack(videoTrack, { priority: 'low' });
        setIsEnabled(true);
        setIsPublishing(false);
      }
    } catch (e) {
      onError(e);
    }
  }, [isEnabled, videoTrack, localParticipant, isPublishing, onError]);

  const toggleCamera = useCallback(async () => {
    if (isPublishing || !videoTrack) {
      return;
    }

    setIsPublishing(true);
    if (isEnabled) {
      localParticipant?.unpublishTrack(videoTrack);
    }

    const newFacingMode =
      mediaStreamTrack?.getSettings().facingMode === 'user' ? 'environment' : 'user';
    await videoTrack.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      facingMode: newFacingMode,
    });

    // turn video back on
    if (isEnabled) {
      await localParticipant?.publishTrack(videoTrack, { priority: 'low' });
    }

    setIsPublishing(false);
  }, [isEnabled, isPublishing, mediaStreamTrack, videoTrack, localParticipant]);

  const isToggleCameraSupported: boolean = Boolean(supportsFacingMode && videoDevices.length > 1);

  return {
    isVideoEnabled: isEnabled,
    toggleVideoEnabled,
    isToggleCameraSupported,
    shouldDisableVideoToggle: isPublishing,
    toggleCamera,
  };
}
