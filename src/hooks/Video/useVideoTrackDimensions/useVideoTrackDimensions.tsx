import { useState, useEffect } from 'react';
import { LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalVideoTrack | RemoteVideoTrack;

export default function useVideoTrackDimensions(track?: TrackType) {
  const [dimensions, setDimensions] = useState(track?.dimensions);

  useEffect(() => {
    setDimensions(track?.dimensions);

    if (track) {
      const handleDimensionsChanged = (_track: TrackType) =>
        setDimensions({
          width: _track.dimensions.width,
          height: _track.dimensions.height,
        });

      track.on('dimensionsChanged', handleDimensionsChanged);
      return () => {
        track.off('dimensionsChanged', handleDimensionsChanged);
      };
    }
  }, [track]);

  return dimensions;
}
