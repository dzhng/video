import { useCallback, useEffect, useState } from 'react';
import { LocalVideoTrack } from 'twilio-video';

import { DEFAULT_VIDEO_CONSTRAINTS } from '~/constants';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

export default function useSwitchCamera() {
  const { localTracks, devices } = useVideoContext();
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

  const toggleCamera = useCallback(() => {
    const newFacingMode =
      mediaStreamTrack?.getSettings().facingMode === 'user' ? 'environment' : 'user';
    videoTrack.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      facingMode: newFacingMode,
    });
  }, [mediaStreamTrack, videoTrack]);

  const isSupported: boolean = Boolean(supportsFacingMode && videoDeviceList.length > 1);

  const shouldDisable: boolean = !videoTrack;

  return { isSupported, shouldDisable, toggleCamera };
}
