import { useCallback, useEffect, useState } from 'react';
import { SELECTED_AUDIO_OUTPUT_KEY } from '~/constants';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

export default function useActiveSinkId() {
  const {
    devices: { audioOutput },
  } = useVideoContext();
  const [activeSinkId, _setActiveSinkId] = useState('default');

  const setActiveSinkId = useCallback(
    (sinkId: string) => {
      window.localStorage.setItem(SELECTED_AUDIO_OUTPUT_KEY, sinkId);
      _setActiveSinkId(sinkId);
    },
    [_setActiveSinkId],
  );

  useEffect(() => {
    const selectedSinkId = window.localStorage.getItem(SELECTED_AUDIO_OUTPUT_KEY);
    const hasSelectedAudioOutputDevice = audioOutput.some(
      (device) => selectedSinkId && device.deviceId === selectedSinkId,
    );
    if (hasSelectedAudioOutputDevice) {
      _setActiveSinkId(selectedSinkId!);
    }
  }, [audioOutput]);

  return { activeSinkId, setActiveSinkId } as const;
}
