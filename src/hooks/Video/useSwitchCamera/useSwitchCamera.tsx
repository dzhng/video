import { useCallback, useEffect, useState } from 'react';
import { LocalVideoTrack } from 'twilio-video';

import { DEFAULT_VIDEO_CONSTRAINTS } from '~/constants';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useLocalVideoToggle from '~/hooks/Video/useLocalVideoToggle/useLocalVideoToggle';

export default function useSwitchCamera() {
  const {
    room: { localParticipant },
    localTracks,
    devices,
  } = useVideoContext();
  const [isEnabled] = useLocalVideoToggle();
  const [supportsFacingMode, setSupportsFacingMode] = useState<Boolean | null>(null);
  const videoTrack = localTracks.find((track) => track.name.includes('camera')) as LocalVideoTrack;
  const mediaStreamTrack = useMediaStreamTrack(videoTrack);
  const videoDeviceList = devices.videoInput;

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

  const toggleCamera = useCallback(async () => {
    const newFacingMode =
      mediaStreamTrack?.getSettings().facingMode === 'user' ? 'environment' : 'user';

    localParticipant?.unpublishTrack(videoTrack);

    await new Promise((resolve) => setTimeout(resolve));
    await videoTrack.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      facingMode: newFacingMode,
    });

    // turn video back on
    await localParticipant?.publishTrack(videoTrack, { priority: 'low' });
  }, [mediaStreamTrack, videoTrack, localParticipant]);

  const isSupported: boolean = Boolean(supportsFacingMode && videoDeviceList.length > 1);

  const shouldDisable: boolean = !videoTrack || !isEnabled;

  return { isSupported, shouldDisable, toggleCamera };
}
