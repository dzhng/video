import React, { useRef, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { Track } from 'twilio-video';

import { IVideoTrack } from '~/utils/twilio-types';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';

const Video = styled('video')({
  width: '100%',
  height: '100%',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        // @ts-ignore: typing for this doesn't include null
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  const style = {
    transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : '',
    objectFit: track.name.includes('screen') ? ('contain' as const) : ('cover' as const),
  };

  return <Video ref={ref} style={style} />;
}
