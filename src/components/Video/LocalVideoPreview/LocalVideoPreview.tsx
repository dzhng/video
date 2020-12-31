import React from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '~/components/Video/VideoTrack/VideoTrack';
import LocalAudioLevelIndicator from '~/components/Video/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find((track) => track.name.includes('camera')) as LocalVideoTrack;

  return videoTrack ? (
    <>
      <VideoTrack track={videoTrack} isLocal />
      <LocalAudioLevelIndicator />
    </>
  ) : null;
}
