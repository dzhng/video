export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 600,
  height: 400,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'SelectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'SelectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'SelectedVideoInput';

// endpoints
export const TWILIO_TOKEN_ENDPOINT = '/api/twilio-token';
export const CONVERT_TOKEN_ENDPOINT = '/api/convert-token';

// database keys
export const CallsRTDBRoot = 'calls';

export const TasksDataKey = 'tasks';
export const ActionItemsKey = 'actionItems';
export const QuestionsKey = 'questions';
export const TakeAwaysKey = 'takeAways';

export const ChatsDataKey = 'chats';
// TODO: support other channels in the future (host only, private 1-1)
export const PublicChatsChannelKey = 'all';

export const CurrentActivityIDKey = 'currentActivityId';
export const ActivityDataKey = 'activityData';
