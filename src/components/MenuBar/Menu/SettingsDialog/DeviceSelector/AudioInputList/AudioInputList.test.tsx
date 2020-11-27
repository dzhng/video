import React from 'react';
import { screen, render } from '@testing-library/react';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import LocalAudioLevelIndicator from '~/components/MenuBar/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { useAudioInputDevices } from '../deviceHooks/deviceHooks';
import AudioInputList from './AudioInputList';

jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/components/MenuBar/LocalAudioLevelIndicator/LocalAudioLevelIndicator');
jest.mock('~/hooks/useMediaStreamTrack/useMediaStreamTrack');
jest.mock('../deviceHooks/deviceHooks');

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
};

mockUseVideoContext.mockImplementation(() => ({
  room: {},
  getLocalAudioTrack: mockGetLocalAudiotrack,
  localTracks: [mockLocalTrack],
}));

mockLocalAudioLevelIndicator.mockImplementation(() => null);

describe('the AudioInputList component', () => {
  it('should display the name of the local audio track when only one is avaiable', () => {
    mockUseAudioInputDevices.mockImplementation(() => [mockDevice]);
    render(<AudioInputList />);
    expect(screen.queryByTestId('select-menu')).toBeNull();
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
    expect(screen.queryByTestId('select-menu')).toBeTruthy();
    expect(screen.queryByTestId('default-track-menu')).toBeNull();
  });

  it('should always render local audio indicator', () => {
    render(<AudioInputList />);
    expect(mockLocalAudioLevelIndicator).toBeCalledTimes(1);
  });
});
