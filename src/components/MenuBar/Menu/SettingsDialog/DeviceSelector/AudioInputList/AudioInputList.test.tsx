import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import LocalAudioLevelIndicator from '~/components/MenuBar/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { useAudioInputDevices } from '~/hooks/deviceHooks/deviceHooks';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_AUDIO_INPUT_KEY } from '~/constants';
import AudioInputList from './AudioInputList';

jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/components/MenuBar/LocalAudioLevelIndicator/LocalAudioLevelIndicator');
jest.mock('~/hooks/useMediaStreamTrack/useMediaStreamTrack');
jest.mock('~/hooks/deviceHooks/deviceHooks');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseAudioInputDevices = useAudioInputDevices as jest.Mock<any>;
const mockLocalAudioLevelIndicator = LocalAudioLevelIndicator as jest.Mock<any>;
const mockGetLocalAudiotrack = jest.fn(() => Promise.resolve);

const mockDevice = {
  deviceId: '123',
  label: 'mock device',
};

const mockLocalTrack = {
  kind: 'audio',
  mediaStreamTrack: {
    label: 'mock local audio track',
    getSettings: () => ({ deviceId: '123' }),
  },
  restart: jest.fn(),
};

mockUseVideoContext.mockImplementation(() => ({
  room: {},
  getLocalAudioTrack: mockGetLocalAudiotrack,
  localTracks: [mockLocalTrack],
}));

mockLocalAudioLevelIndicator.mockImplementation(() => null);

describe('the AudioInputList component', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should display the name of the local audio track when only one is avaiable', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice]);
    render(<AudioInputList />);
    expect(screen.queryByTestId('select-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('default-track-name')?.textContent).toBe('mock local audio track');
  });

  it('should display "No Local Audio" when there is no local audio track', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice]);
    mockUseVideoContext.mockImplementationOnce(() => ({
      room: {},
      getLocalAudioTrack: mockGetLocalAudiotrack,
      localTracks: [],
    }));
    render(<AudioInputList />);
    expect(screen.getByTestId('default-track-name').textContent).toBe('No Local Audio');
  });

  it('should render a Select menu when there are multiple audio input devices', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<AudioInputList />);
    expect(screen.queryByTestId('select-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('default-track-menu')).not.toBeInTheDocument();
  });

  it('should always render local audio indicator', () => {
    render(<AudioInputList />);
    expect(mockLocalAudioLevelIndicator).toBeCalledTimes(1);
  });

  it('should save the deviceId in localStorage when the audio input device is changed', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<AudioInputList />);
    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBe(undefined);
    fireEvent.change(screen.getByTestId('select-menu'), { target: { value: 'mockDeviceID' } });
    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBe('mockDeviceID');
  });

  it('should call track.restart with the new deviceId when the audio input device is changed', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<AudioInputList />);
    fireEvent.change(screen.getByTestId('select-menu'), { target: { value: 'mockDeviceID' } });
    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      deviceId: { exact: 'mockDeviceID' },
    });
  });
});
