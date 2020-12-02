import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import LocalAudioLevelIndicator from '~/components/Video/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { useAudioInputDevices } from '~/hooks/Video/deviceHooks/deviceHooks';
import { SELECTED_AUDIO_INPUT_KEY } from '~/constants';
import AudioInputList from './AudioInputList';

jest.mock('~/hooks/Video/useVideoContext/useVideoContext');
jest.mock('~/components/Video/LocalAudioLevelIndicator/LocalAudioLevelIndicator');
jest.mock('~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack');
jest.mock('~/hooks/Video/deviceHooks/deviceHooks');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseAudioInputDevices = useAudioInputDevices as jest.Mock<any>;
const mockLocalAudioLevelIndicator = LocalAudioLevelIndicator as jest.Mock<any>;
const mockGetLocalAudiotrack = jest.fn(() => Promise.resolve);

const mockDevice1 = {
  deviceId: 'mockDeviceID_1',
  label: 'mock device 1',
};

const mockDevice2 = {
  deviceId: 'mockDeviceID_2',
  label: 'mock device 2',
};

const mockLocalTrack = {
  kind: 'audio',
  mediaStreamTrack: {
    label: 'mock local audio track',
    getSettings: () => ({ deviceId: 'mockDeviceID_1' }),
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
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice1]);
    render(<AudioInputList />);
    expect(screen.queryByTestId('select-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('default-track-name')?.textContent).toBe('mock local audio track');
  });

  it('should display "No Local Audio" when there is no local audio track', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice1]);
    mockUseVideoContext.mockImplementationOnce(() => ({
      room: {},
      getLocalAudioTrack: mockGetLocalAudiotrack,
      localTracks: [],
    }));
    render(<AudioInputList />);
    expect(screen.getByTestId('default-track-name').textContent).toBe('No Local Audio');
  });

  it('should render a Select menu when there are multiple audio input devices', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice1, mockDevice2]);
    render(<AudioInputList />);
    expect(screen.queryByTestId('select-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('default-track-menu')).not.toBeInTheDocument();
  });

  it('should always render local audio indicator', () => {
    render(<AudioInputList />);
    expect(mockLocalAudioLevelIndicator).toBeCalledTimes(1);
  });

  it('should save the deviceId in localStorage when the audio input device is changed', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice1, mockDevice2]);
    render(<AudioInputList />);
    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBe(undefined);

    const item = screen.getByRole('button');
    fireEvent.click(item);

    const option = screen.getByRole('option', { name: 'mock device 2' });
    fireEvent.click(option);

    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBe('mockDeviceID_2');
  });

  it('should call track.restart with the new deviceId when the audio input device is changed', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice1, mockDevice2]);
    render(<AudioInputList />);

    const item = screen.getByRole('button');
    fireEvent.click(item);

    const option = screen.getByRole('option', { name: 'mock device 2' });
    fireEvent.click(option);

    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      deviceId: { exact: 'mockDeviceID_2' },
    });
  });
});
