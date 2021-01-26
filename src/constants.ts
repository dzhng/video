import { isMobile } from '~/utils';

export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 600,
  height: 400,
  frameRate: 24,
};

export const maxTracks = isMobile ? 8 : 50;

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'SelectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'SelectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'SelectedVideoInput';

// endpoints
export const TWILIO_TOKEN_ENDPOINT = '/api/twilio-token';
export const CONVERT_TOKEN_ENDPOINT = '/api/convert-token';
