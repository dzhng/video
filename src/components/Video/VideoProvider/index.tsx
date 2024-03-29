import React, { createContext, useMemo } from 'react';
import {
  CreateLocalTrackOptions,
  ConnectOptions,
  LocalAudioTrack,
  LocalVideoTrack,
  Room,
  TwilioError,
} from 'twilio-video';
import { Callback, ErrorCallback } from '~/utils/twilio-types';

import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';
import AttachVisibilityHandler from './AttachVisibilityHandler/AttachVisibilityHandler';
import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors';
import useHandleOnDisconnect from './useHandleOnDisconnect/useHandleOnDisconnect';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useLocalVideoToggle from './useLocalVideoToggle/useLocalVideoToggle';
import useScreenShareToggle from './useScreenShareToggle/useScreenShareToggle';
import useDevices from './useDevices/useDevices';
import useRoom from './useRoom/useRoom';

export function getAudioInputDevices(devices: MediaDeviceInfo[]) {
  return devices.filter((device) => device.kind === 'audioinput');
}

export function getVideoInputDevices(devices: MediaDeviceInfo[]) {
  return devices.filter((device) => device.kind === 'videoinput');
}

export function getAudioOutputDevices(devices: MediaDeviceInfo[]) {
  return devices.filter((device) => device.kind === 'audiooutput');
}

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

export interface IVideoContext {
  room: Room;
  devices: {
    audioInput: MediaDeviceInfo[];
    videoInput: MediaDeviceInfo[];
    audioOutput: MediaDeviceInfo[];
  };
  localTracks: (LocalAudioTrack | LocalVideoTrack)[];
  isConnecting: boolean;
  connect: (token: string) => Promise<void>;
  onError: ErrorCallback;
  onDisconnect: Callback;
  getLocalVideoTrack: (newOptions?: CreateLocalTrackOptions) => Promise<LocalVideoTrack>;
  getLocalAudioTrack: (deviceId?: string) => Promise<LocalAudioTrack>;
  isAcquiringLocalTracks: boolean;
  removeLocalVideoTrack: () => void;
  removeLocalAudioTrack: () => void;
  getAudioAndVideoTracks: () => Promise<void>;
  isVideoEnabled: boolean;
  toggleVideoEnabled(): void;
  isToggleCameraSupported: boolean;
  shouldDisableVideoToggle: boolean;
  toggleCamera(): void;
  isScreenShared: boolean;
  toggleScreenShare(): void;
}

export const VideoContext = createContext<IVideoContext>(null!);

interface VideoProviderProps {
  options?: ConnectOptions;
  onError?: ErrorCallback;
  onDisconnect?: Callback;
  children: React.ReactNode;
}

export function VideoProvider({
  options,
  children,
  onError = () => {},
  onDisconnect = () => {},
}: VideoProviderProps) {
  const onErrorCallback = (error: TwilioError) => {
    console.log(`ERROR: ${error.message}`, error);
    onError(error);
  };

  const deviceList = useDevices();
  const devices = useMemo(
    () => ({
      audioInput: getAudioInputDevices(deviceList),
      audioOutput: getAudioOutputDevices(deviceList),
      videoInput: getVideoInputDevices(deviceList),
    }),
    [deviceList],
  );

  const {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    isAcquiringLocalTracks,
    removeLocalVideoTrack,
    removeLocalAudioTrack,
    getAudioAndVideoTracks,
  } = useLocalTracks(devices.audioInput, devices.videoInput);

  const { room, isConnecting, connect } = useRoom(localTracks, onErrorCallback, options);

  const {
    isVideoEnabled,
    toggleVideoEnabled,
    isToggleCameraSupported,
    shouldDisableVideoToggle,
    toggleCamera,
  } = useLocalVideoToggle(room, localTracks, devices.videoInput, onErrorCallback);

  const [isScreenShared, toggleScreenShare] = useScreenShareToggle(room, onErrorCallback);

  // Register onError and onDisconnect callback functions.
  useHandleRoomDisconnectionErrors(room, onError);
  useHandleTrackPublicationFailed(room, onError);
  useHandleOnDisconnect(room, onDisconnect);

  return (
    <VideoContext.Provider
      value={{
        room,
        devices,
        localTracks,
        isConnecting,
        onError: onErrorCallback,
        onDisconnect,
        getLocalVideoTrack,
        getLocalAudioTrack,
        connect,
        isAcquiringLocalTracks,
        removeLocalVideoTrack,
        removeLocalAudioTrack,
        getAudioAndVideoTracks,
        isVideoEnabled,
        toggleVideoEnabled,
        isToggleCameraSupported,
        shouldDisableVideoToggle,
        toggleCamera,
        isScreenShared,
        toggleScreenShare,
      }}
    >
      <SelectedParticipantProvider room={room}>{children}</SelectedParticipantProvider>
      {/* 
        The AttachVisibilityHandler component is using the useLocalVideoToggle hook
        which must be used within the VideoContext Provider.
      */}
      <AttachVisibilityHandler />
    </VideoContext.Provider>
  );
}
