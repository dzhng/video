export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'SelectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'SelectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'SelectedVideoInput';

// endpoints
export const TWILIO_TOKEN_ENDPOINT = '/api/twilio-token';
export const CONVERT_TOKEN_ENDPOINT = '/api/convert-token';

export const ROOT_URL = 'https://aomni.co';
