import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';
import { useVideoInputDevices } from '~/hooks/deviceHooks/deviceHooks';
import VideoTrack from '~/components/VideoTrack/VideoTrack';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '~/constants';
import VideoInputList from './VideoInputList';

jest.mock('~/hooks/useVideoContext/useVideoContext');
jest.mock('~/hooks/useMediaStreamTrack/useMediaStreamTrack');
jest.mock('~/hooks/deviceHooks/deviceHooks');
jest.mock('~/components/VideoTrack/VideoTrack');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseVideoInputDevices = useVideoInputDevices as jest.Mock<any>;
const mockVideoTrack = VideoTrack as jest.Mock<any>;
const mockGetLocalVideotrack = jest.fn(() => Promise.resolve);

const mockDevice = {
  deviceId: 'mockDeviceID',
  label: 'mock device',
};

const mockLocalTrack = {
  kind: 'video',
  mediaStreamTrack: {
    label: 'mock local video track',
    getSettings: () => ({ deviceId: 'mockDeviceID' }),
  },
  restart: jest.fn(),
};

mockVideoTrack.mockImplementation(() => null);

describe('the VideoInputList component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockUseVideoInputDevices.mockImplementation(() => []);
    mockUseVideoContext.mockImplementation(() => ({
      room: {},
      getLocalVideoTrack: mockGetLocalVideotrack,
      localTracks: [mockLocalTrack],
    }));
  });

  it('should render VideoTrack with local track when it exists', () => {
    render(<VideoInputList />);
    expect(mockVideoTrack).toBeCalledWith(
      expect.objectContaining({ isLocal: true, track: mockLocalTrack }),
      expect.anything(),
    );
  });

  it('should not render VideoTrack if there are no local track', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: {},
      getLocalVideoTrack: mockGetLocalVideotrack,
      localTracks: [],
    }));

    render(<VideoInputList />);
    expect(mockVideoTrack).not.toBeCalled();
  });

  it('should not display a Select menu and instead display the name of the local video track', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice]);
    render(<VideoInputList />);
    expect(screen.queryByTestId('select-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('default-track-name').textContent).toBe('mock local video track');
  });

  it('should display "No Local Video" when there is no local video track', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice]);
    mockUseVideoContext.mockImplementationOnce(() => ({
      room: {},
      getLocalVideoTrack: mockGetLocalVideotrack,
      localTracks: [],
    }));
    render(<VideoInputList />);
    expect(screen.getByTestId('default-track-name').textContent).toBe('No Local Video');
  });

  it('should render a Select menu when there are multiple video input devices', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<VideoInputList />);
    expect(screen.queryByTestId('select-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('default-track-name')).not.toBeInTheDocument();
  });

  it.skip('should save the deviceId in localStorage when the video input device is changed', async () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<VideoInputList />);
    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBe(undefined);

    fireEvent.click(screen.getByTestId('select-menu'));
    const item = await screen.findByText('mock device');
    fireEvent.click(item);
    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBe('mockDeviceID');
  });

  it.skip('should call track.restart with the new deviceId when the video input device is changed', async () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice, mockDevice]);
    render(<VideoInputList />);
    fireEvent.click(screen.getByRole('button'));
    const item = await screen.findByText('mock device');
    fireEvent.click(item);

    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: 'mockDeviceID' },
    });
  });
});
