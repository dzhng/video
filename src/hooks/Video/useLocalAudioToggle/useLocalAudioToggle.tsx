import { useCallback } from 'react';
import { LocalAudioTrack } from 'twilio-video';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalAudioToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find((track) => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(
    (enabled?: boolean) => {
      if (audioTrack) {
        if (enabled === undefined) {
          audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
        } else {
          enabled
            ? !audioTrack.isEnabled && audioTrack.enable()
            : audioTrack.isEnabled && audioTrack.disable();
        }
      }
    },
    [audioTrack],
  );

  return [isEnabled, toggleAudioEnabled] as const;
}
