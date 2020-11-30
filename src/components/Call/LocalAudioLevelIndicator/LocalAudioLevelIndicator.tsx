import React from 'react';
import { LocalAudioTrack } from 'twilio-video';
import useVideoContext from '~/hooks/Call/useVideoContext/useVideoContext';
import AudioLevelIndicator from '~/components/Call/AudioLevelIndicator/AudioLevelIndicator';

export default function LocalAudioLevelIndicator() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find((track) => track.kind === 'audio') as LocalAudioTrack;

  return <AudioLevelIndicator audioTrack={audioTrack} />;
}
