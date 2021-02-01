import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType =
  | LocalAudioTrack
  | LocalVideoTrack
  | RemoteAudioTrack
  | RemoteVideoTrack
  | undefined;

export default function useIsTrackEnabled(track: TrackType) {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : false);

  useEffect(() => {
    setIsEnabled(track ? track.isEnabled : false);

    if (track) {
      const setEnabled = () => setIsEnabled(true);
      const setDisabled = () => setIsEnabled(false);

      track.on('enabled', setEnabled);
      track.on('disabled', setDisabled);
      track.on('mute', setDisabled);
      track.on('unmute', setEnabled);
      return () => {
        track.off('enabled', setEnabled);
        track.off('disabled', setDisabled);
        track.off('mute', setDisabled);
        track.off('unmute', setEnabled);
      };
    }
  }, [track]);

  return isEnabled;
}
