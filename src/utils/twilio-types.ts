import { LocalVideoTrack, RemoteVideoTrack, TwilioError } from 'twilio-video';

declare module 'twilio-video' {
  interface LocalParticipant {
    setBandwidthProfile: (bandwidthProfile: BandwidthProfileOptions) => void;
    publishTrack(
      track: LocalTrack,
      options?: { priority: Track.Priority },
    ): Promise<LocalTrackPublication>;
  }

  interface VideoCodecSettings {
    simulcast?: boolean;
  }

  // eslint-disable-next-line
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }

  // eslint-disable-next-line
  interface RemoteVideoTrack {
    isSwitchedOff: boolean;
    setPriority: (priority: Track.Priority | null) => void;
  }

  interface VideoBandwidthProfileOptions {
    trackSwitchOffMode?: 'predicted' | 'detected' | 'disabled';
  }
}

declare global {
  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }
}

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError) => void;

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

export type RoomType = 'group' | 'group-small' | 'peer-to-peer';