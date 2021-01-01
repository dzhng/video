import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '~/components/Video/VideoTrack/VideoTrack';
import LocalAudioLevelIndicator from '~/components/Video/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',

  '& div[role=figure]': {
    position: 'absolute',
    height: 34,
    width: 34,
    padding: 5,
    bottom: 5,
    left: 5,
    backgroundColor: theme.palette.grey[800],
    borderRadius: 17,
  },
}));

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find((track) => track.name.includes('camera')) as LocalVideoTrack;

  return videoTrack ? (
    <Container>
      <VideoTrack track={videoTrack} isLocal />
      <div role="figure">
        <LocalAudioLevelIndicator />
      </div>
    </Container>
  ) : null;
}
