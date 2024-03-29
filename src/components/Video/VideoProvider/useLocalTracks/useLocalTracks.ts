import { useCallback, useState } from 'react';
import Video, {
  TwilioError,
  LocalVideoTrack,
  LocalAudioTrack,
  CreateLocalTrackOptions,
} from 'twilio-video';

import {
  DEFAULT_VIDEO_CONSTRAINTS,
  DEFAULT_AUDIO_CONSTRAINTS,
  SELECTED_AUDIO_INPUT_KEY,
  SELECTED_VIDEO_INPUT_KEY,
} from '~/constants';

export default function useLocalTracks(
  localAudioDevices: MediaDeviceInfo[],
  localVideoDevices: MediaDeviceInfo[],
) {
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);

  const hasAudio = localAudioDevices.length > 0;
  const hasVideo = localVideoDevices.length > 0;

  const getLocalAudioTrack = useCallback(async (deviceId?: string) => {
    const options: CreateLocalTrackOptions = { ...(DEFAULT_AUDIO_CONSTRAINTS as {}) };

    if (deviceId) {
      options.deviceId = { exact: deviceId };
    }

    const newTrack = await Video.createLocalAudioTrack(options);
    setAudioTrack(newTrack);
    return newTrack;
  }, []);

  const getLocalVideoTrack = useCallback(async (newOptions?: CreateLocalTrackOptions) => {
    // In the DeviceSelector and FlipCameraButton components, a new video track is created,
    // then the old track is unpublished and the new track is published. Unpublishing the old
    // track and publishing the new track at the same time sometimes causes a conflict when the
    // track name is 'camera', so here we append a timestamp to the track name to avoid the
    // conflict.
    const options: CreateLocalTrackOptions = {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      name: `camera-${Date.now()}`,
      ...newOptions,
    };

    const newTrack = await Video.createLocalVideoTrack(options);
    setVideoTrack(newTrack);
    return newTrack;
  }, []);

  const removeLocalVideoTrack = useCallback(() => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(undefined);
    }
  }, [videoTrack]);

  const removeLocalAudioTrack = useCallback(() => {
    if (audioTrack) {
      audioTrack.stop();
      setAudioTrack(undefined);
    }
  }, [audioTrack]);

  const getAudioAndVideoTracks = useCallback(() => {
    if (!hasAudio && !hasVideo) return Promise.resolve();
    if (isAcquiringLocalTracks || audioTrack || videoTrack) return Promise.resolve();

    setIsAcquiringLocalTracks(true);

    const selectedAudioDeviceId = window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY);
    const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

    const hasSelectedAudioDevice = localAudioDevices.some(
      (device) => selectedAudioDeviceId && device.deviceId === selectedAudioDeviceId,
    );
    const hasSelectedVideoDevice = localVideoDevices.some(
      (device) => selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId,
    );

    const localTrackConstraints = {
      video: hasVideo && {
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: `camera-${Date.now()}`,
        ...(hasSelectedVideoDevice && { deviceId: { exact: selectedVideoDeviceId! } }),
      },
      audio: hasAudio && {
        ...(DEFAULT_AUDIO_CONSTRAINTS as {}),
        ...(hasSelectedAudioDevice && { deviceId: { exact: selectedAudioDeviceId! } }),
      },
    };

    return Video.createLocalTracks(localTrackConstraints)
      .catch((e: TwilioError) => {
        // If any of these erros appear, it may be because the video track
        // does not have permission, so try again with audio only
        if (
          ['NotReadableError', 'NotAllowedError', 'NotFoundError', 'OverconstrainedError'].includes(
            e.name,
          )
        ) {
          const audioTrackConstraints = {
            audio: hasSelectedAudioDevice
              ? { deviceId: { exact: selectedAudioDeviceId! } }
              : hasAudio,
          };

          return Video.createLocalTracks(audioTrackConstraints);
        }

        return Promise.reject(e);
      })
      .then((tracks) => {
        const videoTrack = tracks.find((track) => track.kind === 'video'); // eslint-disable-line @typescript-eslint/no-shadow
        const audioTrack = tracks.find((track) => track.kind === 'audio'); // eslint-disable-line @typescript-eslint/no-shadow
        if (videoTrack) {
          setVideoTrack(videoTrack as LocalVideoTrack);
        }
        if (audioTrack) {
          setAudioTrack(audioTrack as LocalAudioTrack);
        }
      })
      .catch((e: TwilioError) => {
        // if it erros out, it's likely to be the default video/audio devices - it may not exist anymore, clear them
        window.localStorage.removeItem(SELECTED_AUDIO_INPUT_KEY);
        window.localStorage.removeItem(SELECTED_VIDEO_INPUT_KEY);
        return Promise.reject(e);
      })
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [
    hasAudio,
    hasVideo,
    audioTrack,
    videoTrack,
    localAudioDevices,
    localVideoDevices,
    isAcquiringLocalTracks,
  ]);

  const localTracks = [audioTrack, videoTrack].filter((track) => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
  )[];

  return {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    isAcquiringLocalTracks,
    removeLocalVideoTrack,
    removeLocalAudioTrack,
    getAudioAndVideoTracks,
  };
}
