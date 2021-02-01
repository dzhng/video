import { Track, VideoBandwidthProfileOptions } from 'twilio-video';
import { maxTracks } from '~/constants';
import { RenderDimensionValue } from './renderDimensions';

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfileOptions['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  bandwidthProfileMode: VideoBandwidthProfileOptions['mode'];
  maxTracks: string;
  maxAudioBitrate: string;
  renderDimensionLow?: RenderDimensionValue;
  renderDimensionStandard?: RenderDimensionValue;
  renderDimensionHigh?: RenderDimensionValue;
}

type SettingsKeys = keyof Settings;

export interface SettingsAction {
  name: SettingsKeys;
  value: string;
}

export const initialSettings: Settings = {
  trackSwitchOffMode: 'predicted',
  dominantSpeakerPriority: 'standard',
  bandwidthProfileMode: 'grid',
  maxTracks: String(maxTracks),
  maxAudioBitrate: '16000',
  renderDimensionLow: 'low',
  renderDimensionStandard: 'wvga',
  renderDimensionHigh: '960p',
};

// This inputLabels object is used by ConnectionOptions.tsx. It is used to populate the id, name, and label props
// of the various input elements. Using a typed object like this (instead of strings) eliminates the possibility
// of there being a typo.
export const inputLabels = (() => {
  const target: any = {};
  for (const setting in initialSettings) {
    target[setting] = setting as SettingsKeys;
  }
  return target as { [key in SettingsKeys]: string };
})();

export function settingsReducer(state: Settings, action: SettingsAction) {
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
