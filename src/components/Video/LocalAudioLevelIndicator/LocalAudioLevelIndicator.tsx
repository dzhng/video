import React from 'react';
import { LocalAudioTrack } from 'twilio-video';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import AudioLevelIndicator, {
  useVolume,
} from '~/components/Video/AudioLevelIndicator/AudioLevelIndicator';

export default function LocalAudioLevelIndicator() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find((track) => track.kind === 'audio') as LocalAudioTrack;
  const volume = useVolume();

  return <AudioLevelIndicator volume={volume} />;
}
