import React from 'react';
import { screen, render } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import useVideoContext from '~/hooks/Call/useVideoContext/useVideoContext';
import { useVideoInputDevices } from '~/hooks/Call/deviceHooks/deviceHooks';
import VideoTrack from '~/components/Call/VideoTrack/VideoTrack';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '~/constants';
import VideoInputList from './VideoInputList';

jest.mock('~/hooks/Call/useVideoContext/useVideoContext');
jest.mock('~/hooks/Call/useMediaStreamTrack/useMediaStreamTrack');
jest.mock('~/hooks/Call/deviceHooks/deviceHooks');
jest.mock('~/components/Call/VideoTrack/VideoTrack');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseVideoInputDevices = useVideoInputDevices as jest.Mock<any>;
const mockVideoTrack = VideoTrack as jest.Mock<any>;
const mockGetLocalVideotrack = jest.fn(() => Promise.resolve);

const mockDevice1 = {
  deviceId: 'mockDeviceID_1',
  label: 'mock device 1',
};

const mockDevice2 = {
  deviceId: 'mockDeviceID_2',
  label: 'mock device 2',
};

const mockLocalTrack = {
  kind: 'video',
  mediaStreamTrack: {
    label: 'mock local video track',
    getSettings: () => ({ deviceId: 'mockDeviceID_1' }),
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
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice1]);
    render(<VideoInputList />);
    expect(screen.queryByTestId('select-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('default-track-name').textContent).toBe('mock local video track');
  });

  it('should display "No Local Video" when there is no local video track', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice1]);
    mockUseVideoContext.mockImplementationOnce(() => ({
      room: {},
      getLocalVideoTrack: mockGetLocalVideotrack,
      localTracks: [],
    }));
    render(<VideoInputList />);
    expect(screen.getByTestId('default-track-name').textContent).toBe('No Local Video');
  });

  it('should render a Select menu when there are multiple video input devices', () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice1, mockDevice2]);
    render(<VideoInputList />);
    expect(screen.queryByTestId('select-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('default-track-name')).not.toBeInTheDocument();
  });

  it('should save the deviceId in localStorage when the video input device is changed', async () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice1, mockDevice2]);
    render(<VideoInputList />);
    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBe(undefined);

    const item = screen.getByRole('button');
    fireEvent.click(item);

    const option = screen.getByRole('option', { name: 'mock device 2' });
    fireEvent.click(option);

    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBe('mockDeviceID_2');
  });

  it('should call track.restart with the new deviceId when the video input device is changed', async () => {
    mockUseVideoInputDevices.mockImplementation(() => [mockDevice1, mockDevice2]);
    render(<VideoInputList />);

    const item = screen.getByRole('button');
    fireEvent.click(item);

    const option = screen.getByRole('option', { name: 'mock device 2' });
    fireEvent.click(option);

    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: 'mockDeviceID_2' },
    });
  });
});
